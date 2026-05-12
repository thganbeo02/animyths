# ADR-0002: Mythic Tier Design — Caps, Editions, and Partial Soulbinding

- **Status:** Accepted
- **Date:** 2026-05-11
- **Decision Owner:** Zeros

## Context

AniMyths needs a top-tier prestige layer above Prismatic variants. A simple "rarer variant" (e.g., drop rate 0.1% of Prismatic) lacks the narrative and collection depth to be the Phase 2 headline feature. The Mythic tier is designed as the answer.

The tier must solve for several constraints simultaneously:
- It must feel scarce and meaningful — not another gacha drop with a different color.
- It must have a global cap that is genuinely finite and publicly visible.
- It must create anticipation without artificial time pressure.
- It must support long-term content expansion (edition system).
- It must be achievable enough for engaged players without being so common that it loses prestige.
- It must avoid the "first copy" problem that the First-Pull mechanic had (see ADR-0001).

## Decision

The Mythic tier is a pack-exclusive, globally-capped, numbered, edition-based variant system with partial soulbinding.

### Core Properties

**Capped:** Each Mythic template has a hard global cap per edition. 60 mints per template per edition. The cap is never extended, never adjusted, never exception-granted. Once minted, a mint number is permanently assigned to a player account. Account deletion or inactivity does not free the mint number.

**Numbered:** Every Mythic card carries a sequential mint number (#1/60 through #60/60). The number is part of the card's identity, displayed on the card frame, in the Mythic Index, and in any future trade UI.

**Edition-based:** Mythics ship in editions. Genesis Edition is the first, active from Phase 2 launch. Resonance Edition is the second, unlocked when Genesis reaches 75% global exhaustion. Each edition has its own independent cap (60/template) and mint number sequence. Editions are visually differentiated by frame accent color.

**Pack-exclusive:** Mythics do not drop from patrol card rolls. They are only mintable through pack opening. This preserves the pack-opening moment as the Mythic moment and prevents the tier from bleeding into the patrol loop.

**Partial soulbinding:** Within each edition, the first 10 mints of each template (#1-10) are designated "Founders" and are permanently soulbound — cannot be traded, disenchanted, or transferred. Mint #11-60 are tradeable when Phase 3 trading ships.

**Cannot be leveled or fused:** Mythics exist at a fixed stat profile. They are not fusion inputs or targets. This prevents Mythics from being consumed and preserves their scarcity.

**Cannot be disenchanted:** Even when the Atlas opens in Phase 2, Mythics are excluded from disenchant.

### Genesis Edition

- Active at Phase 2 launch.
- 9-12 specific templates are Genesis-eligible (hand-curated list, data-config, not code).
- Cap: 60 mints per eligible template = 540-720 total Genesis Mythics globally.
- Founders: #1-10 of each template = 90-120 total Founder Mythics.

### Resonance Edition

- Unlocks when Genesis reaches 75% global exhaustion (aggregate across all eligible templates, not per-template).
- Has its own 60-mint cap per template and its own Founders subset (#1-10).
- Eligible templates TBD (may overlap, may be separate, decision deferred to Resonance design pass).

### Anti-Spoiler Reveal Rule

When a pack contains a Mythic, the reveal sequence reorders so the Mythic always reveals last — non-Mythic cards skip ahead, the Mythic returns as the finale. This is true for both Standard and Premium packs. If the player has Skip Animation enabled and the pack contains a Mythic, the Mythic always plays its full cinematic regardless of the skip setting.

### Cap Exhaustion Behavior

When a Mythic roll succeeds but the cap for that template-edition pair is exhausted, the roll falls through to Prismatic. The player experiences a Prismatic reveal animation. No notification is shown that "you almost got Mythic."

### Mythic Index (Public Ledger)

A screen showing global Mythic mint progress per template and per edition. Per template: mint count, remaining, Founders vs. tradeable breakdown. Per edition: total progress vs. cap, Resonance trigger status. The Index creates anticipation as the ledger fills.

## Alternatives Considered

### Uncapped Mythic (drop rate only, no hard cap)

Mythics drop at a low rate with no cap. More players get them; scarcity is soft.

**Rejected.** Without a hard cap, Mythics are just "another Prismatic" — rare but replicable. The numbered, capped system with global tracking is what makes Mythics a compelling collectible and differentiates them from all other variants. A soft-cap Mythic provides no long-term content anchor.

### Mythics patrol-droppable

Mythics can drop from patrol card rolls in addition to packs.

**Rejected.** Patrol drops are lower-stakes than pack openings. Making Mythics patrol-droppable dilutes the pack-opening moment and makes the Mythic tier feel less special. The patrol loop and the pack loop should have distinct reward hierarchies.

### All Mythics fully non-tradeable

All 60 mints per template are soulbound, none are tradeable.

**Rejected.** A fully non-tradeable Mythic creates a dead-end for players who pull a duplicate of a Mythic they already own (no stacking — each Mythic is a unique instance). If a player owns Mythic Koba #23 and later pulls Mythic Koba #47, the second is permanently useless. Tradeability for #11-60 gives players a path to extract value from duplicates and creates the Phase 3 trading economy.

### Unlimited editions with immediate unlocks

New editions ship every quarter with no trigger condition.

**Rejected.** Unscheduled editions remove the anticipation mechanics that drive engagement. The 75% Genesis exhaustion trigger creates a known horizon that players can watch approach. Editions should feel like events, not features.

### All 60 mints tradeable

All 60 per template are tradeable, none are soulbound.

**Rejected.** Every TCG and premium collectible product has a "golden ticket" subset — the first few mints carry social and economic prestige disproportionate to subsequent ones. Founders (#1-10) being permanently soulbound creates aspirational content: the first pull of any Mythic template is a genuinely special moment. Forfeiting that for pure tradeability surrenders a significant marketing and social proof tool.

## Consequences

### Positive

- Creates a genuinely finite, globally-rare collectible tier. Players can watch the ledger fill in real time via the Mythic Index.
- Edition system enables long-term content expansion without invalidating previous editions. Genesis and Resonance coexist as parallel collectibles.
- Partial soulbinding creates two distinct aspiration tiers within Mythics: Founders (aspirational social prestige) and tradeable (aspirational economic utility). Both drive engagement.
- The 75% Resonance trigger turns scarcity into content — as Genesis approaches 75%, the Mythic Index becomes a daily-check destination for all players, not just Mythic owners.
- Anti-spoiler reveal rule ensures every Mythic pull is a guaranteed cinematic climax to the pack opening, regardless of position in the reveal order.
- Founders can't be traded, which protects the social prestige signal (a FounderMythic is provably the real thing).

### Negative

- High concurrency risk at mint time. Two players pulling the same template simultaneously requires atomic `SELECT ... FOR UPDATE` locking. Implementation is non-trivial (see ADR-0003).
- Ghost mints (deleted accounts with assigned mints) permanently reduce effective circulation. A Mythic template with many ghost mints is functionally scarcer than the cap implies.
- If Genesis exhausts very slowly (years), Resonance may be delayed indefinitely. No fallback time-gate is defined.
- The 60-cap is fixed. If the game succeeds wildly and players want more Mythics of a popular template, the cap creates genuine artificial scarcity that can feel punitive.

### Neutral

- Mythics are excluded from the Atlas (cannot fuse, cannot enhance, cannot disenchant). This preserves their collectible nature but means they have no gameplay progression value beyond their fixed stat profile.
- Phase 2 Mythics are pack-exclusive; Phase 3 may introduce alternative acquisition paths (events, achievements). The design should not assume pack-exclusive forever.
- Mint numbers are sequential globally, not per-edition-per-template. "Mythic Koba #23/60" refers to the 23rd Genesis Koba globally, not the 23rd overall. This needs clear UI communication.

## Expansion Triggers

- If any template's Genesis cap exhausts within 6 weeks of Phase 2 launch: accelerate Resonance design; consider whether the cap is too low for popular templates.
- If no template reaches 75% Genesis exhaustion within 24 months: revisit the trigger condition; consider a maximum-wait fallback or manual override for Resonance launch.
- If data shows that Mythic duplicates (#11-60) are causing player frustration due to no trade exit: revisit trade timing or introduce a Mythic-specific dust/disenchant path (even at a very poor rate).

## Links

- Related ADRs: ADR-0001 (First-Pull removal — Mythics replace personal prestige), ADR-0003 (atomic minting), ADR-0004 (Resonance trigger)
- Related docs: `docs/private/PRD.md` v0.3, `docs/private/economy.md` v0.2 §10, `docs/private/card-design.md` v0.2 §11