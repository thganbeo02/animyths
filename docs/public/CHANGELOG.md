# Changelog

All notable public-bound changes to AniMyths are documented here.

This project follows Keep a Changelog formatting and uses pre-release `v0.x.y` versions until public release.

## [2026-05-17] — Design System Foundation audit + Navigation Shell prep — v0.1.4

### Added

- Navigation Shell — Started the protected app layout and tab navigation scaffold, including app stack modal registrations and an Atlas placeholder screen.
- Dependencies — Added `expo-font` for app-shell font loading.

### Changed

- Design System Foundation — Audited the token foundation, core UI primitive stubs, and shared component stubs. Confirmed token files are populated while several core primitives and shared components still need implementation before the navigation shell can compile cleanly.
- Core UI Primitives — Started filling in `Text` and `Pressable` primitives as the first pieces of the shared UI layer.

## [2026-05-14] — Design System Foundation + Phase 03 — v0.1.3

### Added

- `docs/public/decisions/ADR-0005-color-token-boundaries.md` — Decision to isolate raw color primitives in `tokens/primitives.ts`, with component-safe tokens in `tokens/colors.ts`. File boundary enforced by convention, not lint yet. Rationale: prevents components from choosing colors by visual resemblance; enables future contrast/theme changes.
- `src/design-system/tokens/primitives.ts` — Raw color values for token authors.
- `src/design-system/tokens/motion.ts` — Shared animation timing tokens.
- `src/design-system/theme.ts` — Plain assembled theme object + `useTheme`.

### Changed

- `src/design-system/tokens/colors.ts` — Full restructure:
  - Exports `colors` (not `palette`) for component consumption.
  - Groups: `surface`, `text`, `border`, `state`, `action`, `faction`, `factionSoft`, `rarity`, `rarityGlow`, `variant`, `gradient`.
  - `satisfies Record<Faction, string>` on faction groups; `satisfies Record<Rarity, string>` on rarity; `satisfies Record<Variant, VariantTreatment>` on variant.
  - All values composed from `colorPrimitives` — no raw hex literals in `colors.ts`.
  - `variant` tokens are treatment metadata (sigil, overlayOpacity, staticGradient), not frame colors.
- `src/design-system/tokens/typography.ts` — Even `fontSize`/`lineHeight`, complete doc-aligned scale including `display`, `bodyLg`, `micro`, `button`, `buttonSm`, `numXl`.
- `src/design-system/tokens/spacing.ts` — Pixel-keyed (`4` through `48`) per design doc.
- `src/design-system/tokens/radius.ts` — Semantic names (`card`, `hero`, `pill`, etc.) per design doc.
- `src/design-system/tokens/shadows.ts` — `none`/`subtle`/`card`/`lifted`/`floating`/`glow` per design doc.
- `src/models/currency.ts` — Mid-tier currency name unified to `fragments`; hard currency kept as `prime`; soft currency as `essence`.
- `docs/private/design.md` — Color section restructured around primitives/colors file boundary, poetic primitives renamed to searchable names, semantic tokens promoted to primary section, `action.primary`/`action.primarySoft` added, variant tokens reframed as treatment metadata, stale component specs updated, Token Authoring Rules added.
- `docs/private/PRD.md` — `Premium Currency` → `Prime`, `Pack Fragments` → `Fragments` throughout.

## [2026-05-11] — Rework: Mythic Tier, removed First-Pulls, updated patrol/pack — v0.1.2

### Added

- `docs/public/decisions/ADR-0001-remove-first-pull.md` — Recorded the decision to remove the First-Pull soulbinding mechanic entirely. Covers the rationale (implementation complexity, collision with fusion loop, persona fit, Mythic as stronger replacement), alternatives considered (retain alongside Mythic, badge-only without soulbinding, keep First-Pulls drop Mythic), and consequences.
- `docs/public/decisions/ADR-0002-mythic-tier-design.md` — Recorded the Mythic tier design decision: capped 60/template/edition, numbered, edition-based (Genesis → Resonance), pack-exclusive, partial soulbinding (Founders #1-10), cannot be leveled or fused. Covers anti-spoiler reveal rule, cap exhaustion fallback, and Mythic Index.
- `docs/public/decisions/ADR-0003-mythic-mint-atomicity.md` — Recorded the engineering decision for atomic mint number assignment: `SELECT ... FOR UPDATE` pattern in Postgres transaction, permanence guarantee (ghost mints exist), exhaustion handling (fall-through to Prismatic silently).
- `docs/public/decisions/ADR-0004-resonance-trigger.md` — Recorded the Resonance Edition launch trigger: 75% global Genesis exhaustion (aggregate across all eligible templates). Covers definition details, no time-gate fallback, per-edition Founders, and admin override safety valve.

### Changed

- `docs/private/PRD.md` (v0.2 → v0.3) — Complete rework aligning PRD with the v0.3 design decision:
  - Removed the First-Pull soulbinding mechanic entirely across all sections. No template-level personal prestige at MVP or Phase 2.
  - Added Mythic Tier specification as Phase 2 headline: capped (60/template/edition), numbered, edition-based (Genesis → Resonance), partially soulbound (Founders #1-10).
  - Patrol durations updated: 30m / 2h / 4h / 8h / 12h; 8h and 12h gated by engagement milestone placeholder.
  - Standard Pack updated: 5 cards → 6 cards, 12 Pack Fragments cost, at least 1 Rare guaranteed.
  - Variant rates at MVP: Standard 90% / Foil 7% / Prismatic 3%.
  - Premium Pack (Phase 2): 10 cards, 1 Epic + 1 Rare guaranteed, premium currency cost.
  - Variant System Health KPIs updated: Prismatic D30 target raised to 45% (at 3% rate), D7 Foil target stays 70%, First-Pull view engagement metric removed.
  - Phasing summary updated: MVP ships Standard + Foil + Prismatic; Mythic + Atlas + Premium Pack in Phase 2.
  - Glossary rewritten: removed First-Pull entry; added Edition, Founder, Genesis, Mint Number, Mythic, Resonance.
- `docs/private/economy.md` (v0.1 → v0.2) — Aligned with rework plan:
  - Removed §10 First-Pull Mechanics entirely; replaced with §10 Mythic System (Phase 2) covering caps, editions, Founder soulbinding, anti-spoiler reveal, atomic minting, Mythic Index.
  - §2.4 patrol durations: 15min → 30min Quick, 1hr → 2hr Short, added Overnight 12hr (32% drop, 95% fragments).
  - §3 Variant rates: 95/4/1 → 90/7/3 at MVP. Added Premium Pack variant table (80/12/8/1) for Phase 2.
  - §4.1 Base Essence: Quick 12→22, Short 50→100, Standard 220 (unchanged), Extended 480 (unchanged), Overnight 750 (new).
  - §4.2 Fragment drops: Quick 20%→25%, Short 35%→45%, Standard 60% (unchanged), Extended 85% (unchanged), Overnight 95% (new).
  - §7 Pack: 5 cards → 6, 10 fragments → 12, removed First-Pull detection, added Premium Pack composition.
  - §9 Atlas: First-Pull protection → Mythic exclusion from fusion and disenchant.
  - §12 Progression: removed First-Pulls collected from all P50 milestones.
  - §13 Health Ratios: Prismatic D30 target raised 25% → 45%.
  - §14 Open Questions: rewrote to reflect rework decisions; removed old First-Pull questions.
- `docs/private/card-design.md` (v0.1 → v0.2) — Aligned with rework plan:
  - Removed §1.9 First-Pull Sigil and §5.6 Soulbound state entirely; replaced with §1.11 Mythic Indicator (Phase 2).
  - §1 anatomy table: replaced First-Pull sigil with Mythic indicator; renumbered Lock and State overlay.
  - §2.1 Thumbnail visible elements: replaced First-Pull sigil with Mythic indicator constraint.
  - §3.6 Rarity vs Variant: added Mythic tier to combination table; updated "Ultimate Prismatic" note.
  - §4: updated drop rate descriptions (Standard ~90%, Foil ~7%, Prismatic ~3%); added Mythic row to §4.6 combination table.
  - §5: removed §5.6 Soulbound state; renumbered remaining states; replaced Soulbound in fusion conflict rules with Mythic.
  - §6 Composition Rules: replaced First-Pull sigil in layer order with Mythic indicator; rewrote Z-index conflict section.
  - §7.1: replaced First-Pull sigil ambient animation with Mythic Founder sigil animation (Phase 2).
  - §7.2: updated pack reveal from 5 to 6 cards; removed First-Pull additional animation; added Mythic reveal spec and anti-spoiler rule.
  - §8.1 Reduced motion: replaced sigil shimmer with Founder sigil shimmer.
  - §8.2 Screen reader: removed First-Pull reading step; added Mythic (Genesis/Resonance/Founder) reading; updated example readings.
  - §8.3 Color-blind: added ✸ sigil for Mythic distinct from ✦ (Foil) and ✶ (Prismatic).
  - §9.4: added Mythic never stacks (count always 1).
  - §9.5: replaced Soulbound conflict with Mythic conflict.
  - §10.1 Component architecture: replaced FirstPullSigil with MythicIndicator.
  - §10.5 Testing checklist: updated for 4-variant and Mythic support.
  - Added §11 Mythic Card Specification (Phase 2) — frame treatment, art window, mint number display, anti-spoiler reveal animation, thumbnail visibility.
  - §12 Open Questions: rewrote all 13 questions (removed First-Pull sigil, Foil/Prismatic sigil questions; added Mythic-specific design questions).
- `docs/private/design.md` (v0.1 → v0.2) — Aligned with rework plan:
  - §4.4 Haptic pairings: replaced First-Pulls with Mythic.
  - §5 (reveal sequence): removed First-Pull settle badge stamp.
  - §8.3 Collection: removed First Pulls filter chip.
  - §8.5 Card Detail: removed First-Pull badge; added Mythic variant indicator; added Mythic mint number/edition/Founder display (Phase 2); renumbered content blocks.
  - §10.9 Pack Forge & Open: 5 cards → 6; removed First-Pull badges from summary screen; added Mythic anti-spoiler note.
  - §12 Profile: removed first-pulls collected stat.
  - Open questions: removed First-Pull badge placement; added Mythic Collection grid sorting question.

## [2026-05-08] — Project setup initialized — v0.1.1

### Added

- `docs/README.md` — Added a public-safe docs index stub.
- `docs/public/decisions/TEMPLATE.md` — Added the ADR template for future public-bound decisions.
- Project foundation — Added Expo, TypeScript, linting, formatting, path alias, and environment scaffolding.

### Changed

- `AGENTS.md` — Updated documentation paths to separate private working references from public-bound docs.
- `.gitignore` — Ignored local notes and private documentation from the start of the repository history.
