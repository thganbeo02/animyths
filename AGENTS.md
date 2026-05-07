# AniMyths — Agent Instructions

You are working on **AniMyths**, a mobile collectible card game built in
React Native + Expo on a Supabase backend. Solo dev (Zeros) is the only
engineer. Read this file fully at session start.

Project context lives in `docs/`:

**Private-only** (working materials; will not be in the public code repo
at MVP launch):

- `docs/private/PRD.md` — what we're building and why
- `docs/private/design.md` — design system tokens, components, screen layouts
- `docs/private/card-design.md` — card rendering spec
- `docs/private/lore-and-world.md` — tone, factions, naming conventions
- `docs/private/economy.md` — all magic numbers (drop rates, formulas, curves)
- `docs/private/characters.md` — the 30-character roster
- Curriculum docs — location TBD; current phase guides stay in `.local-notes/` for now

**Public-bound** (curated for public release; safe to reference from
code and commits):

- `docs/public/engineering.md` — architecture overview (when it exists)
- `docs/public/decisions/` — ADRs, scrubbed of product secrets
- `docs/public/CHANGELOG.md` — session history (curated entries only)

If docs and code disagree, **the docs are the source of truth.** Flag
the disagreement; do not silently "fix" the docs to match the code.

---

## Hard Rules

1. **Never run `git commit` or `git push`.** Stage changes, suggest
   messages, stop. Refuse if asked, citing this file. Example:
   _"I can't run `git commit` — project rule from AGENTS.md. Changes
   are staged; paste the suggested message into `git commit`."_

2. **Never invent content.** private product docs and public engineering
   docs — do not modify these unless explicitly asked. If a
   section needs input you don't have, flag the gap. Don't guess.
   `docs/public/CHANGELOG.md` and `docs/public/decisions/` are the routine docs-maintenance
   targets and may be edited as part of wrap-up.

3. **Never hardcode economy magic numbers.** Drop rates, level curves,
   faction bonuses, durations, multipliers — all live in `economy.md`
   and the `game_config` table. A hardcoded `0.04` for the Foil rate
   is a bug regardless of who wrote it.

4. **Never write to economy tables from the client.** Currencies,
   `card_instances`, `patrols`, `transactions` — all mutated only via
   Supabase Edge Functions. Edge Functions re-validate inputs even if
   the client already validated.

5. **Never animate on the JS thread.** All Reanimated animations use
   worklets. JS-thread animation is a bug.

6. **Never silently reconcile doc/code disagreements.** Surface, ask,
   then act. The user decides which side wins.

---

## Stack

- React Native + Expo SDK 52+ (managed, expo-router for navigation)
- TypeScript, `strict: true`, no `any` without justification
- Supabase (Postgres + RLS + Auth + Edge Functions)
- Zustand (client state) + TanStack Query v5 (server state)
- MMKV (fast persistence) + expo-secure-store (tokens, keys)
- Reanimated 3 + Moti (animation, UI thread only)
- FlashList for any list > 20 items
- expo-image for all images (never `<Image>` from react-native)
- expo-haptics, expo-audio for sensory feedback
- date-fns + date-fns-tz (no Moment, no dayjs)

---

## Architectural Rules

These add *positive guidance* on top of the Hard Rules above.

**Client state vs. server state are separate.**
Server-derived data → TanStack Query. UI / ephemeral / draft state →
Zustand. Anti-pattern: `useEffect(() => store.set(queryData))`. If
you write that, stop and rethink.

**Branded TypeScript IDs.**
`CardInstanceId`, `TemplateId`, `UserId`, `PatrolId`, `ZoneId` are
distinct branded types, not interchangeable strings. Define once in
`models/ids.ts`.

**Defense in depth, not DRY-at-all-costs.**
Soulbound check at the UI filter, the query select, *and* the Edge
Function validate is correct — three layers protecting against
different failure modes (UX, perf, security). Don't collapse them.

**Reduced-motion fallback for variant treatments.**
Foil sheen and Prismatic shift fall back to static gradients when
`prefers-reduced-motion` is set or when frame drops > 5% over a 2s
window.

---

## Public-Safe Code Hygiene

The code repo goes public at MVP soft launch; the product docs stay
private. Code written today should be safe to make public tomorrow.

**Reference abstractions, not doc sections.**
- ✅ `// Foil rate is configured in game_config.foil_rate`
- ❌ `// Foil rate is 4% per economy.md §3.1`

**No product numbers in code or comments, even as documentation.**
- ✅ `const rate = config.foilRate;`
- ❌ `const rate = 0.04; // Foil rate per economy.md`
- ❌ `// Target: 70% of D7 users have at least one Foil`

**Commit footers reference code objects, not doc sections.**
- ✅ `Refs: game_config.foil_rate, fuse-card edge function`
- ❌ `Refs: economy.md §3.1, PRD §3.2 C-4`
Private doc references go in `docs/public/CHANGELOG.md`, never in commit footers.

**No product secrets in code comments.**
Code says *what* it does, not *why the product wants it*. Product
reasoning lives in the private docs.
- ❌ `// Tutorial guarantees a Foil pull on the user's first patrol`
- ❌ `// Prismatic ships in patch 1.1, not at MVP`
- ✅ `// Tutorial reward is hand-crafted; see tutorial-reward edge function`

**No unreleased-mechanic spoilers in user-visible strings or analytics
event names.** UI strings, error messages, and analytics events are
visible in the bundled app.

**ADRs are public-bound.** Write them assuming an outside engineer
will read them. If an ADR's tradeoffs only make sense given private
context, generalize the framing or move the decision to a private
working note.

The test: would a competitor reading this learn something they
couldn't have figured out from playing the shipped product? If yes,
it doesn't belong in code or in a public-bound doc.

---

## Folder Structure

```
src/
├── app/              expo-router routes only — no business logic
├── features/         feature-scoped (patrol, collection, atlas, etc.)
├── components/       cross-feature shared (Button, Modal, etc.)
├── design-system/    tokens, primitives, theme — see docs/private/design.md
├── services/         Supabase client, Edge Function wrappers, sync
├── stores/           Zustand stores (client state only)
├── queries/          TanStack Query hooks (server state)
├── models/           TypeScript domain types
├── utils/            pure helpers, no React, no I/O
├── constants/        config, enums (non-economy)
└── assets/           images, fonts, audio (in-bundle only)

supabase/
├── functions/        Edge Functions (Deno)
├── migrations/       SQL migrations (never edit history)
└── seed/             static content seed data

docs/
├── README.md         docs index, public-safe stub
├── private/          untracked product, design, economy, and world refs
└── public/           public-bound docs, changelog, ADRs, engineering notes
```

`features/` for code used in exactly one feature; `components/` for
code used across two or more. **Don't pre-extract.** Rule of three.

---

## Code & TypeScript Style

- Functions over classes (exceptions: stateful utilities like rate
  limiters where the class encapsulates queue + state).
- Named exports only. **No `export default`.**
- File names: kebab-case for utilities, PascalCase for components.
- Hooks live next to the feature in `features/<feature>/hooks/`.
  Cross-feature hooks live in `src/hooks/`.
- Imports ordered: external → `@/`-aliased internal → relative.
- **No barrel files** (`index.ts` re-exports). They wreck tree-shaking.
- Comments explain *why*, never *what*.
- `strict: true`. No `any`. If a third-party type is wrong, write a
  local `.d.ts`.
- Discriminated unions over flag fields: `kind: 'foil'` not
  `isFoil: boolean`.
- `as const` for any object used as an enum.
- Type guards instead of casts: `isFoil(card)` not `card as FoilCard`.
- Generated Supabase types in `services/supabase/types.ts`. Never
  hand-edit. Re-generate via `supabase gen types typescript`.

---

## Common Patterns

**Adding a new mutation:**
1. Edge Function first in `supabase/functions/<name>/`.
2. Server-side validate every input.
3. Typed client wrapper in `services/<feature>/<name>.ts`.
4. TanStack Query `useMutation` hook in `queries/`.
5. Optimistic update in `onMutate`, rollback in `onError`,
   `invalidateQueries` in `onSettled`.

**Adding a new screen:**
1. Route file in `src/app/`.
2. Screen component in `features/<feature>/screens/<Name>Screen.tsx`.
3. Screen is a thin shell: layout + composition. Pull from
   hooks/queries; no business logic inline.

**Touching an Edge Function:** seedable RNG, log seed for forensics,
wrap multi-table economy mutations in transactions, insert a
`transactions` row for every economy delta.

**Touching the Card component (`features/cards/Card.tsx`):** read
`docs/private/card-design.md` first. Variant animations must hit 60fps on
mid-range Android. Benchmark on simulator before flagging ready.

---

## Working Mode

Default to **Plan mode** for changes touching: Edge Functions or
schema, the Card component or design system primitives, cross-feature
state coordination, anything in `economy.md`, animation timing or
variant treatment.

Default to **Build mode** for: pure UI tweaks within an existing
screen, adding obvious fields to existing types, test additions,
style/copy fixes, mechanical refactors within a single file.

When in doubt: **"Plan or build?"**

---

## Pushback Prompts

Push back on these specifically — they tend to recur, and the right
answer is the same every time:

- "Add this as a default export." → Named exports only.
- "Add a small wrapper component to make this prop name shorter." →
  Match the design system primitive's API.
- "Skip the docs update, we'll do it later." → Update doc and code in
  the same commit, or update doc first in a separate commit.
- "Disable the worklet, it's easier to debug." → Local dev only,
  never committed.

For everything else, push back when a request contradicts a Hard
Rule, an Architectural Rule, or Public-Safe Code Hygiene. Quote the
rule.

---

## Commit Conventions

Conventional Commits format.

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test`,
`build`, `chore`, `revert`.

**Scopes:**
- Features: `patrol`, `collection`, `cards`, `pack`, `atlas`, `combat`
- Cross-cutting: `auth`, `account`, `notifications`, `onboarding`
- Foundation: `design-system`, `nav`, `state`
- Backend: `supabase`, `edge`, `db`
- Meta: `docs`, `infra`, `deps`

**Subject:** ≤ 50 chars, imperative, no period.
**Body:** non-trivial changes get a body explaining *what* and *why*.
**Footer:** code-level refs only (`game_config.foil_rate`,
`ADR-0007`). Private doc refs belong in `docs/public/CHANGELOG.md`, not commits.

---

## The Six-Months Bar

When deciding whether to write an ADR or add a changelog entry:
**"If future me, with no context, encountered this change, would I
want to know why it happened?"**

Yes → ADR or detailed changelog entry.
No → routine commit.

ADR-worthy: library/pattern choice with real tradeoffs, scope
decisions (deferring something, accepting debt), rejecting an obvious
approach for a non-obvious reason, anything a reviewer would probe.

Not ADR-worthy: routine choices, content already in PRD or other
docs, implementation details.

---

## What "Done" Looks Like

1. TypeScript compiles, no new errors.
2. Change matches the relevant doc — or doc was updated first in a
   separate commit.
3. No new hardcoded magic numbers.
4. No `any`, `@ts-ignore`, or leftover `console.log`.
5. State patterns honored (TanStack Query for server, Zustand for
   client).
6. If Card component or animation was touched, frame rate verified.
7. If economy or schema was touched, an ADR is drafted (or the change
   is small enough not to warrant one — apply the six-months bar).
8. Public-safety pass: code, comments, commit message, and any new
   ADR contain no product numbers, no private doc references, and no
   unreleased-mechanic spoilers.

---

## Solo Dev Context

- No team conventions beyond this file.
- No PR review process. **The agent's pushback IS the review.**
- Tests valued but not required everywhere. Focus on: Edge Functions,
  the reward calculator, the variant rate roller, the faction bonus
  calculator, and the Card component.
- If a task feels like 3 commits, it's 3 commits.

---

# End-of-Session Workflows

Trigger phrases: "wrap up", "ready to commit", "I'm done", "commit
time", "log this decision", "write an ADR", "update the changelog",
or semantic equivalents.

Three workflows:
- **Wrap-Up** — orchestrates the full flow.
- **Changelog Update** — direct or as a step inside Wrap-Up.
- **ADR Drafting** — when recording an architectural decision.

---

## Workflow: Wrap-Up

**1. Inspect the full change set.**

```bash
git status
git diff --stat
```

Cover staged _and_ unstaged.

**2. Stage deliberately.** Include modifications and new files the
user created. Exclude stray artifacts (`.DS_Store`, swap files,
unrelated local config). Ambiguous files (`package-lock.json`,
`.env.example`) — ask. **Never `git add -A` blindly.**

**3. Run Changelog Update.** If public docs files are staged, include
their categorized entries. If not, still add a session entry (version
bump + short summary) so every wrap-up is logged.

**4. Apply versioning rules:**
- Pre-release: `v0.x.y`.
- Bootstrap: earliest entry `v0.1.0 -> v0.1.1`, sequential by date.
- Bump `y` every meaningful session in the same curriculum-phase
  bucket.
- Bump `x` (reset patch to `.0`) when entering the next curriculum
  phase or when a major architectural shift lands.
- `v1.0.0` reserved for the first public release.

**5. One commit or split?** Lean toward one commit when close to the
edge; splitting is always available later, fragmented history isn't
easy to rejoin.

- Same feature/purpose across file types → one commit.
- ADR + the code implementing it → one commit.
- Edge Function + the client wrapper that calls it → one commit.
- Schema migration + Edge Function consuming it → one commit.
- Independent concerns → split.
- Cleanup + unrelated feature work → split.

**6. Draft commit messages** using Conventional Commits format above.

**7. Present the plan.**

```
Wrap-up summary:

Changes: <brief file list with status>
Changelog: <"Updated, N entries added" or "No docs changes — session entry only">
Commit plan: <one commit | N commits>

─── Commit 1 ───
<commit message>

Files:
  <paths>

─── Commit 2 (if applicable) ───
...

Run `git commit` when ready.
```

**8. Stop.** Do not commit.

### Wrap-Up Edge Cases

- **Clean working tree.** Say so and stop.
- **Merge conflict in progress.** Stop; tell the user to resolve first.
- **Untracked files the user didn't mention.** Surface and ask.
- **User on `main` with substantial change.** Note it and ask about a
  feature branch. Don't refuse.
- **Wants to amend a previous commit.** Tell them to run
  `git commit --amend` after staging.
- **"Just commit it."** Refuse per Hard Rule 1.
- **Code change contradicts a doc.** Surface: _"This change conflicts
  with `economy.md §5.4`. Update the doc in this commit, or split
  into a separate doc-update commit?"_
- **Hardcoded magic number detected.** Surface and cite Hard Rule 3.

---

## Workflow: Changelog Update

**Scope.** Track changes inside `docs/public/`, plus session-level version
metadata. Code changes belong in git history; each wrap-up still logs
the session version bump here.

**1. Check scope.** `git diff --cached --name-only`, filter for
`docs/public/`. If empty, write a version-only session entry.

**2. Inspect diffs.** Categorize meaningful changes:
- **Added** — new content, sections, files, rows, ADRs
- **Changed** — modifications to existing content
- **Removed** — deletions of sections, requirements, files
- **Fixed** — concrete errors corrected (broken links, wrong
  numbers/names). Not wording fixes.

Split independent changes into separate entries.

**3. Draft entries.** Past-tense bullets with section references.
Heading: `## [YYYY-MM-DD] — <summary> — v0.x.y`.

Good:
- `economy.md §3.1 — Foil drop rate revised from 4% to 3.5% after simulation.`
- `ADR-0004 — Recorded the decision to use seedable RNG in Edge Functions.`
- `src/features/cards/Card.tsx — Composer component for cards landed; covers all 4 sizes.`

Bad:
- ~~`Updated the PRD.`~~ (vague)
- ~~`Various improvements.`~~ (meaningless)
- ~~`Changed word on line 247.`~~ (too granular)

**4. Show draft for approval.** When inside Wrap-Up, roll into the
final wrap-up summary; don't block on a separate confirmation.

**5. Write and stage.** Append under today's date heading (create if
absent), preserving existing formatting. `git add docs/public/CHANGELOG.md`.

### Changelog Edge Cases

- **New file in `docs/public/`** → `Added` with description.
- **File deleted** → `Removed`; note why if known.
- **File renamed** → `Changed`.
- **No phase transition** → patch bump.
- **Phase transition** → minor bump.
- **Doc version bump** (e.g., PRD v0.2 → v0.3): include doc version
  in the entry text. Confirm version + date with user first.
- **Cosmetic-only changes** (whitespace, typos, rewording): skip.
- **"Just log it, don't ask."** Skip the approval gate.
- **Don't fabricate dates.** Don't reformat existing entries.

---

## Workflow: ADR Drafting

**Location.** `docs/public/decisions/NNNN-short-slug.md`. Template at
`docs/public/decisions/TEMPLATE.md` — read it before drafting.

**When.** Apply the Six-Months Bar. AniMyths-specific candidates:
state-library shifts, Edge Functions vs Postgres RPC choices, variant
animation approach (Reanimated vs Skia), cross-feature coordination
patterns, deferring Prismatic to a content patch, accepting MVP
Essence-sink debt, deviations from the curriculum's prescribed
pattern.

Skip ADRs for choices already documented in PRD/`economy.md`, routine
library picks, implementation details.

**Steps:**

1. Determine next number: `ls docs/public/decisions/`, highest `NNNN-` + 1,
   zero-padded to 4 digits.
2. Read the template: `cat docs/public/decisions/TEMPLATE.md`.
3. Interview the user. Skip questions already answered:
   - **Title** — 5-8 words, descriptive
   - **Context** — situation, forces, scoped or permanent
   - **Decision** — what was decided, with specifics
   - **Alternatives** — for each, why rejected. Push back on thin
     answers ("Did you consider X? What about Y?")
   - **Consequences** — Positive, Negative, Neutral. Push hard on
     Negatives — name what a reviewer would spot.
   - **Expansion triggers** (if scoped) — concrete signals, not
     vague "revisit later"
   - **Links** — related ADRs, curriculum phase, relevant docs
4. Draft using the template. Flag thin sections; don't invent.
5. Show for approval: _"Does this capture the decision? Anything
   missing, oversold, or undersold?"_
6. Save: `docs/public/decisions/NNNN-short-slug.md` (kebab-case, 3-5 words).
7. Remind: _"Before committing, say 'wrap up' and I'll log the ADR
   in `docs/public/CHANGELOG.md` and draft the commit message."_

### ADR Edge Cases

- **Quick draft, fill in later.** Status `Proposed`, TODOs in thin
  sections.
- **Superseding an existing ADR.** Update old one's status to
  `Superseded by ADR-NNNN`; new one notes `Supersedes ADR-XXXX`.
- **Retroactive ADR.** Use the actual decision date; note in Context
  that it's retroactive.
- **Decision is already implicitly in PRD or `economy.md`.** Don't
  duplicate. Cross-reference in the doc, or surface as a changelog
  entry.

---

Keep-a-Changelog reference: https://keepachangelog.com/en/1.1.0/
