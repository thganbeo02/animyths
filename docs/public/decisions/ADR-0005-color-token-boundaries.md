# ADR-0005: Separate Primitive Color Tokens

- **Status:** Accepted
- **Date:** 2026-05-14
- **Decision Owner:** Zeros

## Context

The design system needs to provide stable color choices for app UI, game-domain identities, and future visual treatments without encouraging components to choose raw hex values by visual resemblance.

A single exported color object creates ambiguity when raw colors and semantic roles sit next to each other. For example, a component author can choose a raw dark color for body text because it matches the current text token, even though the component actually needs the semantic role. Over time, that creates inconsistent usage and makes later contrast or theme changes harder.

The color system also includes game-domain concepts that are not generic UI states: factions, rarities, and variant treatments. These still need to be consumed by components, but they should be distinct from raw primitives and from generic UI roles.

## Decision

Raw color values are isolated in `src/design-system/tokens/primitives.ts` and composed into component-safe tokens in `src/design-system/tokens/colors.ts`.

Components should import `colors.ts` or the assembled `theme`, not `colorPrimitives` directly. `colorPrimitives` exists to give token authors named raw values; `colors` exists to give components semantic UI roles and game-domain identities.

The component-safe color API is organized into flat groups:

- UI roles: `surface`, `text`, `border`, `state`, `action`
- Game identities: `faction`, `factionSoft`, `rarity`, `rarityGlow`, `variant`
- Composed multi-stop treatments: `gradient`

Variant tokens are treatment metadata, not frame colors. Rarity controls frame accents; variant controls sigils, overlay opacity, and static fallback gradients.

Faction soft colors remain explicit tokens rather than opacity-derived values. This keeps soft faction backgrounds stable across white cards, tinted panels, and gradient surfaces.

## Alternatives Considered

### Single exported palette

Expose one object containing raw colors, semantic roles, faction colors, rarity colors, and variant colors.

**Rejected.** This makes it too easy for component code to use raw colors directly. The code may look correct today while losing the semantic intent needed for future contrast, theme, and accessibility changes.

### Semantic tokens only

Expose only generic UI roles such as `text.primary`, `state.success`, and `surface.card`, and avoid game-domain color groups.

**Rejected.** Faction and rarity are first-class visual identities. Components need to render specific factions and rarities by domain value, and forcing those concepts through generic UI states would make the API less clear.

### Derive soft faction colors with opacity

Use the primary faction color with opacity for softer backgrounds instead of maintaining separate soft tokens.

**Rejected.** Opacity blends differently depending on the underlying surface. Explicit soft tokens are more predictable and avoid context-dependent rules about when opacity is safe.

### Model variants as colors

Represent variants as `Record<Variant, string>` with one color per variant.

**Rejected.** Variants are visual treatments layered over rarity, not replacement frame colors. A single color per variant would blur the separation between rarity frame accents and variant overlays.

## Consequences

### Positive

- Component code chooses colors by role or domain identity instead of raw visual match.
- Future theme or contrast changes can update semantic mappings without touching every component.
- Faction and rarity token completeness is enforced with TypeScript `satisfies` checks against domain unions.
- Variant treatments can grow from static fallback metadata into richer animated treatments without changing the public token shape.

### Negative

- Token authors must maintain two files instead of one.
- Some raw values are named only to support one semantic token or treatment, which can feel verbose early in the project.
- The boundary is currently enforced by convention and review; lint enforcement may be added later.

### Neutral

- `colors.ts` remains the component-facing API even though it includes both semantic UI roles and game-domain identities.
- Raw primitives are not a design API. They are implementation details used to compose the exported color system.

## Expansion Triggers

- If raw primitive imports appear outside token-composition files, add lint enforcement for the import boundary.
- If dark mode ships, revisit whether `colors.ts` should export separate light/dark token sets behind `useTheme()`.
- If animated variant treatments need more structured metadata, expand the `variant` token shape while preserving the role/treatment separation.

## Links

- Related ADRs: None
- Related code objects: `src/design-system/tokens/primitives.ts`, `src/design-system/tokens/colors.ts`, `src/design-system/theme.ts`
