# ADR-0001: Remove the First-Pull Soulbinding Mechanic

- **Status:** Accepted
- **Date:** 2026-05-11
- **Decision Owner:** Zeros

## Context

During the v0.3 rework, the decision was made to remove the First-Pull mechanic entirely from the AniMyths product. The mechanic, as originally specced, worked as follows: the first time any player pulled a card of a given template from any source (patrol, pack, tutorial), that specific card instance was permanently marked as a "Soulbound First-Pull" — unfusable, undiscardable, timestamped, and visually marked.

The mechanic was intended to provide *personal prestige* — a record of the first time you met each character. It was the second layer of a two-layer prestige system (Variants for global prestige, First-Pulls for personal prestige).

Several forces drove the removal:

1. **Implementation complexity.** The mechanic required tracking per-template ownership state, rendering the sigil across all card sizes, special animation sequences, separate First-Pulls views, First-Pull-specific fusion rules, and per-instance soulbinding in the data model.

2. **Collision with the collection loop.** First-Pull instances being unfusable created a permanent "best copy" problem — players with a Foil First-Pull couldn't use it to level a Standard of the same template, even if they wanted to. The mechanic protected one copy but reduced the utility of a visual prestige item.

3. **User story fit.** The persona analysis identified the Crossover Collector and Idle Optimizer as primary, and the Lapsed TCG Player as secondary. First-Pulls mapped to the Lapsed TCG Player ("the first Charizard you caught"), but the resource investment required to spec, implement, and maintain the mechanic was disproportionate to the secondary persona.

4. **A stronger replacement was available.** The Mythic tier (see ADR-0002) provides a form of global scarcity prestige that is also personal — numbered, capped, tracked in the Mythic Index. A player's Mythic Koba #7/60 is simultaneously a globally scarce item and a personally meaningful unique instance. It serves the emotional role First-Pulls were playing without the collision with the fusion loop.

5. **Variant chase clarity.** With First-Pulls removed, the game has two clean prestige axes: visual variants (Standard/Foil/Prismatic) for aesthetic collection, and Mythic for numeric uniqueness. These don't interfere with each other or with the card leveling system.

## Decision

The First-Pull mechanic is removed from AniMyths at all phases. No template-level soulbinding, no sigil, no timestamp, no First-Pulls view, no First-Pull badge in pack reveals.

All affected documents have been updated: PRD v0.3, economy.md v0.2, card-design.md v0.2, design.md v0.2. The changelog records the removal.

## Alternatives Considered

### Retain First-Pull alongside Mythic

Keep the mechanic as a parallel system: First-Pulls for personal sentimental prestige, Mythics for global scarcity prestige. They serve different purposes.

**Rejected.** The two systems are functionally redundant at the emotional level — both make a specific card instance feel special. Having both adds implementation surface area with no additive value. The Mythic tier subsumes the use case while adding a layer of global scarcity that First-Pulls never could.

### First-Pull without soulbinding (badge only, fusable)

Remove the unfusable/locked behavior but keep the sigil and timestamp. The First-Pull is celebrated but not protected.

**Rejected.** The soulbinding was the only thing that distinguished First-Pulls from a simple "first acquired" metadata field. A badge without protection is just a colored chip — it doesn't carry the emotional weight the mechanic was designed to provide, while still requiring the sigil rendering and First-Pulls view infrastructure.

### Keep First-Pulls, remove Mythic

Mythics are too complex (atomic minting, edition system, cap exhaustion, public ledger). First-Pulls are simpler and sufficient.

**Rejected.** The Mythic tier is a stronger product differentiator. A capped, numbered, edition-based system with global tracking is what separates AniMyths from other mobile CCGs. First-Pulls are a standard mechanic in gacha games. Mythics are not.

## Consequences

### Positive

- Removes one entire category of per-instance state tracking and rendering logic.
- Eliminates the "best copy" problem — no card is permanently unfusable due to acquisition order.
- Mythic tier now cleanly owns the "personal unique instance" emotional space without competing with fusion.
- Variant rates (90/7/3) become the sole chase for visual collection, simpler to communicate and understand.
- First-Pulls view, sigil rendering, and all First-Pull-specific animation states are removed from the codebase.

### Negative

- The Lapsed TCG Player persona loses the "first-of-character" memory mechanic. This is the only persona left without a tailored prestige hook (Crossover Collector has variants; Idle Optimizer has faction math and drop rate optimization).
- Players who would have valued a "my first Koba is permanent" memory have no equivalent at MVP. (Phase 2 Mythics partially fill this for players who pull a Mythic.)
- Tutorial pull satisfaction is reduced — the Foil tutorial pull is now just a Foil, not a "First-Pull Foil." Mitigated by ensuring Foil tutorial pull is still visually impactful.

### Neutral

- First-Pull was specced in v0.1. Removing it after that investment represents rework cost, but it was caught before implementation began.
- The Mythic tier increases complexity in a different direction — but that complexity is justified by its global scope and scarcity guarantee.

## Expansion Triggers

- If post-launch data shows significant player frustration with not having a "first of character" memory (e.g., CSAT scores, feedback, engagement drop around collection), revisit with a simpler implementation: a "first acquired" timestamp on each template visible in Card Detail, no sigil, no fusion restriction.
- If the Mythic tier fails to resonate (D30 Mythic ownership <5%), the product loses both its personal prestige layer and its global scarcity layer simultaneously. In that case, revisit whether a simpler First-Pull variant (badge only, no soulbinding) should be reintroduced.

## Links

- Related ADRs: ADR-0002 (Mythic tier design), ADR-0003 (Mythic atomic minting), ADR-0004 (Resonance trigger)
- Related docs: `docs/private/PRD.md` v0.3, `docs/private/economy.md` v0.2, `docs/private/card-design.md` v0.2, `docs/private/design.md` v0.2