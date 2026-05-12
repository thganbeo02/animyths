# ADR-0003: Mythic Mint Number Assignment is Global, Atomic, and Permanent

- **Status:** Accepted
- **Date:** 2026-05-11
- **Decision Owner:** Zeros

## Context

The Mythic tier depends on globally unique, sequential mint numbers (#1/60 through #60/60 per template per edition). A Mythic Koba #7/60 is meaningfully distinct from Mythic Koba #23/60 — the lower the number, the rarer. This means mint number assignment must satisfy three properties:

1. **Uniqueness:** no two players can be assigned the same mint number for the same template-edition pair.
2. **Atomicity:** checking the current count and incrementing it must happen in a single database transaction to prevent race conditions.
3. **Permanence:** once a mint number is assigned, it is never reclaimed, reassigned, or freed — even if the owning account is deleted.

The system must also handle the exhaustion case gracefully: when a Mythic roll occurs but the cap is reached (all 60 mints assigned), the roll falls through to Prismatic with no notification to the player.

## Decision

Mint number assignment uses a `SELECT ... FOR UPDATE` pattern within a Postgres transaction. The `mythic_editions` table (template_id, edition, cap, minted_count, is_active, exhausted_at) is the source of truth. The Edge Function handling pack opening wraps the check-and-increment in a serializable transaction.

### Implementation

```
BEGIN;
  SELECT * FROM mythic_editions
    WHERE template_id = :template_id AND edition = :edition
    FOR UPDATE;
  -- Row is locked. Check minted_count < cap AND is_active = true.
  IF satisfied:
    new_mint_number = minted_count + 1;
    UPDATE mythic_editions SET minted_count = new_mint_number
      WHERE template_id = :template_id AND edition = :edition;
    IF minted_count == cap:
      UPDATE mythic_editions SET is_active = false, exhausted_at = now()
        WHERE template_id = :template_id AND edition = :edition;
    INSERT INTO card_instances (...) VALUES (...);
    INSERT INTO transactions (...) VALUES (...);
  ELSE:
    -- Fall through: variant = 'prismatic', no mythic row written
COMMIT;
```

The `mythic_editions` table is write-accessible only via Edge Functions running with `service_role`. Clients read `mythic_editions` for the public Mythic Index (read-only, no RLS restrictions beyond account scoping).

### Permanence

- Account deletion: no effect on `mythic_editions.minted_count` or assigned `card_instances`. Ghost mints exist in perpetuity.
- Account inactivity: no effect.
- No admin override exists to free a mint number. No mechanism exists to reassign a reclaimed number.
- A player who pulls Mythic Koba #7 and then deletes their account still holds #7. The number stays with the account.

### Exhaustion Handling

When `minted_count >= cap` or `is_active = false`:

1. The transaction falls through without inserting a Mythic card instance.
2. The variant is set to `prismatic` in the pack reveal.
3. A Prismatic card is inserted instead.
4. No message is shown to the player indicating "Mythic was rolled but denied." This is intentional — showing the near-miss is punishing UX.
5. The `mythic_editions` row remains readable (showing 60/60 minted) so the Mythic Index reflects the exhausted state.

### Data Model

`card_instances` table adds fields for Mythic support:

- `variant`: `'standard' | 'foil' | 'prismatic' | 'mythic'`
- `mythic_mint_number`: INTEGER NULL (populated only when variant = 'mythic')
- `mythic_edition`: TEXT NULL (populated only when variant = 'mythic')
- `is_founder`: BOOLEAN DEFAULT FALSE (true when mythic_mint_number BETWEEN 1 AND 10)
- `is_soulbound`: BOOLEAN DEFAULT FALSE (true for Founders; can be extended by per-template hand-curated rules)

`mythic_editions` table:

```
template_id            FK -> card_templates
edition                TEXT (genesis, resonance, ...)
cap                    INTEGER (default 60)
minted_count           INTEGER (default 0)
is_active              BOOLEAN (default true)
exhausted_at           TIMESTAMP NULL

PRIMARY KEY (template_id, edition)
```

## Alternatives Considered

### Optimistic concurrency with retry

Use a non-locking increment (e.g., `UPDATE ... SET minted_count = minted_count + 1 RETURNING minted_count`) with application-level retry on constraint violation.

**Rejected.** Postgres's `RETURNING` pattern is atomic at the statement level but not at the transaction level when checking the cap. A race between two simultaneous requests could result in both succeeding and exceeding the cap. The `SELECT ... FOR UPDATE` pattern is the standard solution for this class of problem and is well-understood by Postgres engineers.

### Distributed lock (Redis, etc.)

Use an external distributed lock service to serialize mint operations.

**Rejected.** Adds an external dependency with its own failure modes. The Postgres `SELECT ... FOR UPDATE` pattern handles this within the existing database without introducing a new service to monitor and operate.

### Lazy cap enforcement (allow over-mint, reconcile later)

Allow the cap to be exceeded, detect violations post-commit, and compensate (e.g., downgrade one of the over-cap cards to Prismatic).

**Rejected.** This creates a situation where players may briefly see a Mythic card in their collection that is later downgraded — a trust-destroying UX. Post-hoc reconciliation is also fragile and complex to implement correctly with the `transactions` audit log.

### Soft cap with manual reset

Allow mints to be reclaimed if a player is inactive for N months, or if an account is deleted and confirmed inactive.

**Rejected.** This creates exploitable scenarios (players creating accounts to farm early mints, deleting, repeating) and undermines the permanence guarantee that makes Founders valuable. The ghost mint cost (reduced effective circulation) is the correct trade-off. A template with many ghost mints is simply scarcer — this is aligned with the product's scarcity positioning.

## Consequences

### Positive

- Guarantees uniqueness: no two players ever hold the same mint number of the same template-edition.
- Guarantees atomicity: no race condition can cause cap overruns.
- Guarantees permanence: ghost mints are a known and accepted consequence of the permanence guarantee.
- `SELECT ... FOR UPDATE` is a well-understood, battle-tested pattern. Any Postgres-competent engineer can review and maintain it.
- The transaction boundary is clear: all writes (increment, insert card, insert transaction log) happen or none happen. No partial state.

### Negative

- `SELECT ... FOR UPDATE` introduces row-level lock contention. At high concurrency (many players opening packs simultaneously), queue depth can increase. Mitigation: the lock is held for a very short duration (single row, no complex computation), so contention is minimal under normal load. Peak load (Phase 2 launch day) may need monitoring.
- Ghost mints permanently reduce effective circulation. A template with 20 deleted-account mints out of 60 has only 40 mints remaining. This cannot be detected or addressed without violating the permanence guarantee.
- No ability to correct an erroneous mint assignment (e.g., if a bug assigns the wrong mint number). Once minted, the number is permanent. Data integrity validation must be rigorous before commit.
- The `mythic_editions` row must exist before any Mythic can be minted for that template-edition pair. Pack opening must handle the case where no edition row exists yet — this is a data initialization concern, not a code concern.

### Neutral

- The `is_active` flag prevents new mints after exhaustion, but does not prevent reads. Players can still see the 60/60 state via the Mythic Index after a template is exhausted.
- The `exhausted_at` timestamp is recorded for analytics but has no operational effect (the `is_active = false` flag is the operational signal).

## Expansion Triggers

- If Postgres lock contention becomes measurable at high load: evaluate row-level vs. table-level locking, or consider a dedicated minting queue service.
- If ghost mint rate exceeds 10% of any template's cap: this signals abnormal account deletion patterns and warrants investigation — not a fix to the permanence guarantee, but a data health review.
- If a bug causes an incorrect mint number assignment and no rollback path exists: emergency data correction via admin tooling (exceptional case, not a design target).

## Links

- Related ADRs: ADR-0002 (Mythic tier design), ADR-0004 (Resonance trigger)
- Related code: `supabase/functions/open-pack/index.ts`, `supabase/migrations/` (schema)
