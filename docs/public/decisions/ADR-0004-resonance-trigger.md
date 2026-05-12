# ADR-0004: Resonance Edition Launch Triggered by 75% Genesis Global Exhaustion

- **Status:** Accepted
- **Date:** 2026-05-11
- **Decision Owner:** Zeros

## Context

The Mythic tier is edition-based (see ADR-0002). After Genesis Edition ships at Phase 2 launch, there must be a defined trigger for the next edition (Resonance) to activate. The trigger should create anticipation, reward sustained engagement, and avoid arbitrary scheduling or manual decision-making.

A time-gate (e.g., "Resonance launches 12 months after Genesis") is the simplest approach but creates artificial pressure and doesn't reflect actual game health. A fixed date removes the emergent quality of watching the ledger fill.

A metric-based trigger (e.g., "Resonance launches when 75% of Genesis caps are exhausted") ties the launch to actual player behavior and creates a shared, trackable goal.

## Decision

Resonance Edition activates when Genesis reaches **75% global exhaustion** — meaning 75% of total Genesis mint capacity has been minted across all Genesis-eligible templates, in aggregate.

Specifically: sum of `minted_count` across all Genesis `mythic_editions` rows, divided by sum of `cap` across all Genesis rows, reaches ≥ 0.75.

This is evaluated continuously. The first moment the threshold is crossed, Resonance Edition is unlocked — new Mythic mints can roll for Resonance-eligible templates, and the Mythic Index updates to show Resonance tracking.

### Definition Details

- **Global, not per-template.** The trigger is not "75% of each individual template." It is "75% of all Genesis mints combined." This means if Template A is very popular and reaches 60/60 while Template B is at 20/60, the aggregate still counts toward the trigger. This is intentional — a few very fast templates should not block the edition launch for templates that are more slowly minted.
- **Aggregate across all Genesis templates.** If there are 10 Genesis-eligible templates with cap=60 each, total Genesis capacity = 600. Resonance triggers when `SUM(minted_count) >= 450` across all 10 template rows.
- **Threshold is inclusive.** 75.0% triggers, not 75.1%. A player whose mint causes the aggregate to cross 450/600 triggers the Resonance edition for the entire player base.
- **Resonance trigger is one-way.** Once Resonance activates, it stays active. There is no mechanism to deactivate it.
- **Per-edition Founders.** Resonance Edition has its own Founders subset (#1-10 per Resonance template) that are independently soulbound. A Founder Koba from Genesis is distinct from a Founder Koba from Resonance.

### Resonance Eligible Templates

Resonance has its own template list. The list is data-config (not code) and is designed at the Resonance design pass. It may overlap with Genesis templates (allowing re-mints of the same character in a new edition), may be entirely separate, or may be a curated superset. This decision is deferred.

### Fallback Behavior

**No time-gate fallback is defined.** If Genesis exhausts very slowly (e.g., 36 months to reach 75%), Resonance waits indefinitely. An admin override flag exists as a safety valve — if the trigger needs to be bypassed for any reason (beta/test scenarios, emergency deployment), a database flag can manually activate Resonance. This flag is operational tooling, not a design path.

**Rationale:** Setting a maximum-wait time-gate (e.g., "Resonance ships 18 months after Genesis regardless of exhaustion") creates artificial pressure on players to whale before time runs out, which is a monetization signal that contradicts the product's tone. An indefinite wait preserves the emergent scarcity narrative. Players who want to influence the timeline engage with the game; players who wait watch the Index.

## Alternatives Considered

### Per-template triggers

Resonance activates per template when that template reaches 75% exhaustion. Popular templates trigger earlier; slow templates trigger later. Resonance is always active for any template that has crossed the threshold.

**Rejected.** This fragmenting the edition into a rolling series of per-template activations makes the Mythic Index harder to design and communicate. The global aggregate trigger gives the Resonance moment a single dramatic activation point — everyone watches together as the threshold is crossed, and Resonance ships simultaneously across all templates. Per-template triggers would make the Mythic Index a scrolling list of different states rather than a single narrative.

### Time-gate fallback

If Genesis does not reach 75% exhaustion within N months (e.g., 18), Resonance activates regardless.

**Rejected.** The artificial time pressure is problematic for the reasons stated above. Players who are close to the trigger but haven't crossed it feel pressured to spend before the window closes. This contradicts the product's cozy, patient tone. If Genesis is slow, that is information — not a problem to solve with a deadline.

### Manual activation only

Resonance activates when Zeros decides to activate it, with no defined trigger.

**Rejected.** Without a defined trigger, Resonance becomes a content decision rather than an emergent game event. Players lose the ability to watch the Index and anticipate the launch. The product loses a piece of shared narrative. A defined trigger converts the Mythic Index from a read-only tracker into a live countdown.

### 100% exhaustion required

Resonance triggers only when every Genesis template is fully exhausted (60/60).

**Rejected.** Some templates will exhaust much faster than others. Waiting for the slowest template to also reach 60/60 could take years, during which the most popular templates have been fully distributed and the ledger is static. 75% captures most of the scarcity experience while keeping the trigger achievable.

### 50% exhaustion

Resonance triggers at half-exhaustion.

**Rejected.** 50% is too early. It would allow Resonance to launch before Genesis has been meaningfully distributed. The point of the trigger is to let Genesis build scarcity before the next edition begins. 75% strikes the right balance — enough remaining (25%) to keep Genesis collecting attractive, but enough minted (75%) to signal that scarcity is real.

## Consequences

### Positive

- Creates a shared, trackable goal for the entire player base. The Mythic Index becomes a live countdown, not just a mint tracker.
- Ties Resonance to actual player behavior rather than a marketing calendar or arbitrary deadline.
- Per-template variety in mint speed is absorbed by the global aggregate — fast templates don't block slow templates.
- The 75% threshold is achievable for engaged players while still requiring sustained play (not achievable on day one).
- Founders from Genesis are permanently more scarce than non-Founders (cap 10 vs. cap 60) — the trigger doesn't devalue Genesis Founders.
- No pressure on players who are close to the threshold but haven't crossed it (75% is inclusive, not "just over").

### Negative

- If Genesis is very slow to exhaust, Resonance is delayed — potentially by years. The 75% trigger could feel anticlimactic if it takes 3+ years to reach.
- Some players will track the Index obsessively; when the trigger is hit, demand for Resonance-eligible Mythics will be extreme in the first days. Capacity planning for pack-opening on the trigger day is important.
- The aggregate metric requires accurate accounting across all `mythic_editions` rows. If a data migration or schema change corrupts the `minted_count` values, the trigger could fire early or late. Data integrity validation is critical.

### Neutral

- The trigger is measured continuously, not at a schedule. The moment 75% is crossed, Resonance activates — even if it's 3am. No human coordination required.
- Resonance triggers for all players simultaneously across all platforms and time zones. This is a global product event.
- The admin override flag means the trigger is not fully trustless — a rogue admin could manually activate Resonance early. This is an accepted operational risk, mitigated by requiring elevated access to set the flag.

## Expansion Triggers

- If Genesis reaches 75% within 6 weeks of Phase 2 launch: evaluate whether the cap is too low for popular templates, or whether demand simply outpaced supply estimates. This is a "high demand" signal, not a bug.
- If Genesis does not reach 50% within 12 months: evaluate whether Mythic tier engagement is healthy. Low engagement with Mythics (D30 Mythic ownership <5%) may indicate the mechanic isn't resonating — revisit ADR-0002.
- If a bug causes the `minted_count` sum to be incorrect and the trigger fires early or late: emergency correction via admin tooling. Data integrity checks on the `mythic_editions` table should be part of the release checklist.

## Links

- Related ADRs: ADR-0002 (Mythic tier design), ADR-0003 (atomic minting)
- Related docs: `docs/private/economy.md` v0.2 §10.3, `docs/private/PRD.md` v0.3
