# Steady → Next.js + Convex — build plan & progress

This is the resumable status doc for porting the `docs/workout-prototype-app.md` prototype into the real Next.js (App Router) + Convex app, conforming to `docs/architecture.md`. If you're picking this up in a fresh conversation: read this file first, then `docs/architecture.md` (code-splitting/data-fetching rules) and `docs/workout-prototype-app.md` (the source prototype, only needed when porting a feature not yet built — its static exercise library is already ported in full).

## Decisions already made (don't re-ask)

1. **Auth**: real multi-user auth via **Convex Auth** (`@convex-dev/auth`, password provider). Every table has `userId`; every query/mutation scopes by `ctx.auth.getUserIdentity()` (via a `requireUserId(ctx)` helper in `convex/lib/auth.ts` for mutations, or a direct `getAuthUserId(ctx)` null-check for queries that should degrade to empty rather than throw).
2. **Styling**: Tailwind v4 utilities, not a verbatim CSS port. Design tokens live in `app/globals.css` as a `@theme` block (see below).
3. **Routing vs. sheets**: real routes only for content worth deep-linking (`/`, `/routines/[id]`, `/exercises/[name]`, `/sessions/[id]`, `/progress`, `/stats`, `/login`). Everything else (routine/folder editors, exercise picker, live logging, workout summary) is a shared modal/sheet UI stack, not routes — see `shared/ui/SheetHost.tsx`.
4. **This Next.js version (16.2.10) has real breaking changes** vs. typical training-data knowledge: `params`/`searchParams` are Promises, `middleware.ts` is deprecated in favor of `proxy.ts` (same signature, just renamed export), parallel-route slots need `default.tsx`, Turbopack is default. **Before writing any routing/data-fetching code, check `node_modules/next/dist/docs/`** — don't trust memory for this version. Same caution applies to `@convex-dev/auth`: its own doc comments have been observed to be *wrong* for the installed version (e.g. `Password` is a **named** export, not default — caught by reading the compiled `.js`, not the `.d.ts` docstring). When in doubt, check the compiled source in `node_modules`.

## Environment facts

- Convex project: `kmd-workout`, dev deployment `robust-owl-233` (team `rammahkarpous`). `.env.local` has `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL` already set.
- To push backend changes: `npx convex dev --once` (or leave `npx convex dev` running while iterating).
- A dev server tends to already be running in this environment on **port 3001** (Next's lockfile blocks a second `next dev`; check `lsof -i -P -n | grep LISTEN` before starting a new one, or just curl the existing one). **Gotcha found during M3's first real browser check**: a long-running instance can serve a stale Turbopack CSS build where `app/globals.css`'s `@theme` block silently isn't applied — the whole app renders unstyled (white bg/black text instead of the dark palette) with zero console errors, so it's easy to miss from `curl`/`tsc` checks alone. If a browser screenshot ever looks unstyled, `kill` the pid on 3001 and restart `next dev` before assuming it's a code bug.
- Package manager: npm. TypeScript throughout (`.ts`/`.tsx`), not JS.
- Verification approach used through M2 (no browser automation available in this environment): `npx tsc --noEmit`, `npx convex dev --once` (catches schema/function errors), `curl` route smoke tests (expect 307 → `/login` when signed out, never a 500), and `npx convex run <fn> '<json>'` to check mutation/query argument validators independent of auth.
- **As of M3, real browser verification is possible**: no `chromium-cli` binary is preinstalled, but `npm install --no-save playwright` + `npx playwright install chromium` works fine from a scratch dir (e.g. the session scratchpad) without touching the project's `package.json`. Drive it with a plain Playwright script (sign up a throwaway test account via the login form's "Create an account" toggle, `#email`/`#password` fields — Convex Auth password provider has no seeded test user) and screenshot key screens. Do this after each milestone from here on; don't let click-through UX regress to "unverified" again.

## Judgment calls made during the build (flag if you disagree)

- **"Log cardio" button added to the home screen.** The prototype's CSS clearly designs for a two-button grid (`.action.strength` / `.action.cardio`), and `startCardio()`/`renderCardio()` are fully implemented, but no button in the dumped prototype's JS actually called `startCardio()` — it looked like dead/orphaned code. Added a real "Log cardio" entry point (`features/workout/components/LogCardioButton.tsx`) next to "Quick start" rather than porting the feature as unreachable.
- **Bug fixed before M2**: `shared/ui/SheetHost.tsx` originally only rendered the top-of-stack sheet, so pushing the exercise picker on top of e.g. the routine editor fully unmounted the editor and wiped its draft on pop. Fixed to keep every stacked sheet mounted (hidden via the `hidden` attribute, not unmounted) — this matters a lot for M3+ since nested pushes are everywhere.
- **M3: dedicated cardio sessions folded into exercise history.** The prototype's `exStats`/`exHistory` only scan `type==="strength"` sessions' nested `exercises[]` — a dedicated `type==="cardio"` session (from "Log cardio") was never counted toward that cardio exercise's Summary/History, seemingly because the prototype never actually reached `startCardio()` (see the judgment call above). Since we made "Log cardio" a real, reachable flow, `getExerciseHistory` in `convex/exercises.ts` treats a matching `session.cardioType` the same as a nested cardio exercise entry, so cardio logged either way shows up on `/exercises/[name]`.
- **M3: exercise detail opens as a stacked sheet from inside live logging / the routine editor, not a route navigation.** `/exercises/[name]` is a real deep-linkable route (used from `RoutineDetail`/`SessionDetail`, which are routes themselves), but `SheetHost` is mounted in the root layout and persists across `router.push` — so navigating away from inside an open sheet wouldn't unmount it, it'd just leave the sheet's fixed overlay covering the new page. Rather than force a `closeAll()` (and lose an in-progress logging draft or routine edit just to look at an exercise's PRs), `ExerciseDetailTabs` is pushed as another stacked sheet in that case, reusing the same nested-push mechanism the exercise picker already relies on. `onBack` is `pop` in the sheet case, `router.back()` by default for the routed case.
- **M4: added a denormalized `userStats.totalSessions` counter instead of counting sessions on read.** `convex/_generated/ai/guidelines.md` is explicit: "Never use `.collect().length` to count rows... maintain a denormalized counter in a separate document." The Progress tab's "total sessions" stat tile would otherwise need exactly that unbounded count, so `finishStrengthSession`/`finishCardioSession` now upsert a `userStats` row (`+1` per save) in the same transaction as the session insert, and `getTotalSessionsCount` just reads it. Sessions are never deleted anywhere in this app, so an increment-only counter can't drift.

---

## Folder structure (as built so far)

```
app/
  layout.tsx                 ✅ Convex Auth providers, BottomNav, SheetHost, dark theme
  page.tsx                   ✅ Workout home (preloadQuery)
  loading.tsx                ✅
  globals.css                ✅ Tailwind v4 @theme tokens
  login/page.tsx              ✅
  routines/[id]/page.tsx      ✅ (+ loading.tsx)
  sessions/[id]/page.tsx      ✅ (+ loading.tsx)
  exercises/[name]/page.tsx   ✅ M3 (+ loading.tsx)
  progress/page.tsx           ✅ M4 (no loading.tsx — plain client component, no server await to suspend on)
  stats/page.tsx               ⬜ placeholder only, real build in M5
proxy.ts                     ✅ route protection (repo root, NOT inside app/)

features/
  auth/components/LoginForm.tsx                          ✅
  workout/
    components/ GreetingHeader, WeekStrip, RoutineCard,
                 FolderRow, QuickStartButton,
                 LogCardioButton, WorkoutHome,
                 RoutineTrendChart                        ✅ (RoutineTrendChart added M3)
    editors/ RoutineEditorSheet, FolderEditorSheet        ✅
  logging/
    components/ ActiveStrengthScreen, ActiveCardioScreen,
                 WorkoutSummaryScreen, ElapsedTimer,
                 SessionDetail                            ✅
    state/ hooks/                                         ⬜ not needed so far — draft state lives as
                                                              local useState in the orchestrating sheet
                                                              component (SheetHost now keeps it mounted,
                                                              so no cross-sheet store was necessary; revisit
                                                              only if a real need shows up)
  exercises/
    library/ library.ts, exData.ts, exArt.ts, bodySvg.ts,
             exInfo.ts, aggregateLoad.ts                  ✅ full static library ported verbatim
    components/ ExerciseThumb, BodyMap, MusclePanel,
                 ExercisePickerSheet,
                 ExerciseDetailTabs                       ✅ (ExerciseDetailTabs added M3)
    hooks/ useExerciseHistory.ts                          ✅ M3
  progress/  components/ ProgressScreen, RhythmChart,
             StrengthPerExerciseChart, SessionHistoryList  ✅ M4
  stats/     components/ (WeekNav, SetsTab, BodyTab, TrendsTab, TargetEditDialog, RadarChart)  ⬜ M5

shared/
  ui/ Sheet, SheetHeader, SheetHost (stack, fixed),
      ConfirmDialog, AlertDialog, Chip, BottomNav,
      SetBlock, SetTable, icons.tsx (incl. StrengthIcon/
      CardioIcon, moved here from their button components
      in M4 so SessionHistoryList could reuse them too)    ✅
  charts/ LineChart ✅ M3, BarChart ✅ M4, RadarChart ⬜ M5
  lib/ date.ts (week boundaries, greeting, formatDuration,
       formatDate, formatFullDate)                          ✅
       epley.ts (1RM estimate)                              ✅ M3

convex/
  schema.ts                  ✅ all tables + indexes (see below)
  auth.ts / auth.config.ts / http.ts   ✅ generated by @convex-dev/auth CLI
  lib/auth.ts                ✅ requireUserId(ctx) helper
  workout.ts                 ✅ folders + routines CRUD
  exercises.ts               ✅ listCustomExercises, createCustomExercise,
                              getExerciseHistory (bounded scan, folds in dedicated cardio
                              sessions — M3), scanExerciseHistory (M4: extracted plain
                              helper so progress.ts reuses the same scan instead of a
                              second one), listAllLoggedExerciseNames (M3)
  logging.ts                 ✅ finishStrengthSession, finishCardioSession (both now also
                              upsert the userStats counter — M4), getSession,
                              getThisWeekSummary, getRoutineSessions (M3),
                              listRecentSessions (paginated, M4), getTotalSessionsCount (M4)
  progress.ts                 ✅ M4: weeklyRhythm (6-week bounded range query),
                              strengthPerExercise (reuses scanExerciseHistory)
  stats.ts                   ⬜ M5: getWeekSets, getWeekMuscleLoad, getWeekTrends, getTargets, setTarget
```

### `convex/schema.ts` (built, all of it — nothing pending here)

- `folders`: `userId, name, collapsed, createdAt` — index `by_user`.
- `routines`: `userId, name, folderId?, exercises: [{name, cardio, sets:[{weight?,reps?,min?}]}], createdAt, updatedAt` — indexes `by_user`, `by_user_folder`.
- `sessions`: `userId, type("strength"|"cardio"), ts, durationSec, notes?, routineName?, exercises?:[{name,cardio,sets:[{weight?,reps?,min?,done?}]}], cardioType?, duration?, intensity?` — indexes `by_user_ts`, `by_user_routineName`.
- `customExercises`: `userId, name, primaryMuscle, createdAt` — indexes `by_user`, `by_user_name`.
- `userStats`: `userId, totalSessions` — index `by_user` (one row per user, added M4; see the M4 judgment call above for why this exists instead of a `.collect().length`).
- `targets`: `userId, group, min, max` — indexes `by_user`, `by_user_group` (one row per user per broad muscle group; missing rows fall back to `DEFAULT_TARGETS` client-side).
- Plus Convex Auth's own tables via `...authTables`.

---

## Milestone checklist

### M0 — Foundations ✅ DONE
- [x] Install `convex` + `@convex-dev/auth`
- [x] Convex project created, schema pushed
- [x] Convex Auth wired: `proxy.ts` (not `middleware.ts`) protects every route except `/login`; password sign-in/sign-up form
- [x] Root layout: providers, `BottomNav` (fixed bar → floating pill ≥768px), `SheetHost`
- [x] Tailwind `@theme` tokens matching prototype's dark palette
- [x] Static exercise library ported verbatim (`features/exercises/library/*`) — 104 strength exercises + 7 cardio types, cross-checked for completeness (104/104 in EXDATA, 111/111 = 104+7 in EX_KEY)

### M1 — Workout home + routines CRUD ✅ DONE
- [x] `convex/workout.ts`: `listFoldersAndRoutines`, `getRoutine`, folder CRUD (delete un-sets `folderId` on members), routine CRUD with server-side `resolveFolder` (case-insensitive match-or-create)
- [x] `convex/exercises.ts`: `listCustomExercises`, `createCustomExercise`
- [x] Shared primitives: `SetBlock` (mode `"routine"|"log"`), `Sheet`/`SheetHeader`/`SheetHost`, `ConfirmDialog`/`AlertDialog`, `Chip`
- [x] Exercise primitives: `ExerciseThumb`, `BodyMap` (roles + load modes), `MusclePanel`
- [x] `ExercisePickerSheet`: browse by category / search / "+ Add '‹name›'" → muscle-group picker → `createCustomExercise`
- [x] Workout home (`/`, preloaded): greeting, week strip, folders (collapsible + overflow menu), ungrouped routines, new folder/routine
- [x] Routine detail (`/routines/[id]`, preloaded): target-sets table, muscles-trained panel, edit/delete

### M2 — Live logging + summary + sessions ✅ DONE
- [x] **Bug fix**: `SheetHost` now keeps all stacked sheets mounted (see above)
- [x] `convex/logging.ts`: `finishStrengthSession`/`finishCardioSession` (server-side re-strip too), `getSession`, `getThisWeekSummary`
- [x] `ActiveStrengthScreen`: timer, `SetBlock` log mode, add-exercise via picker, Finish → mixed-done confirm → strip → summary → save/discard
- [x] `ActiveCardioScreen`: standalone form (type chips, duration, intensity, StairMaster tip) → summary → save/discard
- [x] `WorkoutSummaryScreen`: shared stats-tiles/notes/save/discard shell
- [x] Wired "Quick start", "Log cardio" (added, see judgment call above), "Start routine"
- [x] `/sessions/[id]`: read-only session detail (set tables, note, muscles-worked)

**Verified for M0–M2**: `tsc --noEmit` clean, Convex functions deploy clean, all routes 307→`/login` with no 500s, mutations pass argument validation and correctly reject only on the auth check, static library data cross-checked for completeness. Browser click-through was deferred at the time; retroactively confirmed clean during M3's verification pass (see below) once M3's stale-dev-server CSS issue was found and fixed — M0–M2 UI itself had no bugs, the app was just being screenshotted against broken CSS.

### M3 — Routine trend chart + exercise detail ✅ DONE
- [x] `convex/exercises.ts` additions:
  - `getExerciseHistory(name, limit=60)`: bounded scan — walks `by_user_ts` newest-first (`take(301)` to detect an over-cap), filters in JS for sessions containing that exercise name (both nested `exercises[]` entries in strength sessions **and** dedicated `type:"cardio"` sessions whose `cardioType` matches — see judgment call above), stops at `limit` matches or the 300-session cap, returns `{matches, scannedAll}`. Powers both the exercise detail Summary tab (PR computation: heaviest weight, best est. 1RM via `epley1RM`, best set volume, best session volume, times logged) and History tab — fetched once via `useExerciseHistory`, both tabs consume the same result. `scannedAll:false` shows a "showing your most recent sessions" note.
  - `listAllLoggedExerciseNames`: distinct exercise names from a bounded 300-session scan (strength `exercises[]` names + cardio `cardioType`s), for M4's Progress tab select.
- [x] `convex/logging.ts` addition: `getRoutineSessions(routineName)` — `by_user_routineName` index, ordered desc, `take(50)` — for the routine detail trend chart.
- [x] `shared/charts/LineChart.tsx`: hand-drawn SVG line chart (dataviz skill invoked first) — 2px line, ≥8px ringed end-dots, hairline recessive gridlines, one direct end-label, tap/hover crosshair+tooltip. Single-series only (routine trend, one metric at a time), so no legend box per the skill's own rule.
- [x] `shared/lib/epley.ts`: `epley1RM(weight, reps)` helper.
- [x] Routine detail (`/routines/[id]`) trend chart via `RoutineTrendChart.tsx`: metric switcher chips (Volume/Reps/Duration), headline stat (latest session, or `"<planned> planned"` from the routine's own target sets if unlogged, or "–" for Duration with no sessions since routines don't carry a target duration), the line chart if ≥2 sessions, "Do it again to see a trend." if exactly 1.
- [x] `/exercises/[name]` route (+ `loading.tsx`) — 3 tabs via `ExerciseDetailTabs.tsx`:
  - **Summary**: cardio (`CARDIO.includes(name)`) shows sessions/longest/total-minutes; strength shows the PR list, or an empty state.
  - **History**: every past match newest-first with a mini `SetTable`, each linking to `/sessions/[id]`.
  - **Muscles**: region/movement/compound-or-isolation line, `BodyMap` `"roles"` mode, primary (blue)/secondary (orange) chip lists, via `exInfo()`.
  - `useExerciseHistory.ts` wraps the `getExerciseHistory` query.
- [x] Wired "tap exercise name → exercise detail" from `SetBlock`'s `onOpenDetail`, routine detail's exercise rows, and session detail's exercise rows (including the dedicated-cardio-session block). From real routes (`RoutineDetail`, `SessionDetail`) it's a plain `router.push`; from inside a sheet (`ActiveStrengthScreen`, `RoutineEditorSheet`) it's `push("exercise-detail", <ExerciseDetailTabs onBack={pop} />)` — a stacked sheet, not a route change — see the judgment call above for why.
- [x] "Last time" reference wiring: `ActiveStrengthScreen` now renders each row through a `LoggingSetBlock` wrapper that calls `useExerciseHistory(exercise.name)` itself (one bounded subscription per exercise, keeps rules-of-hooks safe as exercises are added/removed) and passes the most recent match's sets as `previousSets`. `RoutineEditorSheet` intentionally does **not** wire `previousSets` — `SetBlock` only renders the "last time" line in `mode==="log"`, and the editor is `mode==="routine"`, so there was nothing to wire there.

**Verified for M3**: `tsc --noEmit` clean, `npx convex dev --once` clean, `npx convex run` sanity checks on all three new functions (empty/graceful when unauthenticated), curl smoke tests on `/exercises/[name]` (307→`/login`, no 500). **First actual browser click-through of the app** (Playwright installed to the session scratchpad, not a project dependency): signed up a throwaway account, created a routine, logged a set, confirmed the trend chart, all three exercise-detail tabs with real data, and the "last time" reference on a second logging pass — all correct, zero console errors. Caught and fixed a stale-dev-server CSS issue along the way (see Environment facts above); not an M3 regression, but the first time anyone had looked at a rendered screen since M0.

### M4 — Progress tab ✅ DONE
- [x] `convex/logging.ts`: `listRecentSessions` (`usePaginatedQuery`-backed, `by_user_ts` desc, `initialNumItems: 20`). `weekStats` turned out not to need its own function — "sessions this week" already comes from `getThisWeekSummary` (reused as-is), so the only genuinely new stat was `getTotalSessionsCount`, which reads the M4 `userStats` counter (see judgment call above — a raw `.collect().length` isn't allowed per the Convex guidelines file).
- [x] `convex/progress.ts` (new file, one-file-per-feature): `weeklyRhythm(currentWeekStartTs)` — a single bounded range query over the 42-day/6-week window, bucketed in JS; `strengthPerExercise(name)` — calls the same `scanExerciseHistory` helper `getExerciseHistory` uses (extracted out of `convex/exercises.ts` in this milestone) rather than re-scanning, groups matches by `sessionId` taking the max weight, returns oldest-first for the chart.
- [x] `shared/charts/BarChart.tsx`: same mark-spec family as `LineChart` (≤24px bars, 4px rounded cap / square baseline, one accent hue reserved for the highlighted current-week bar, rest in a recessive `bg-surface-2` step, sparse direct label only on non-zero bars). Didn't re-invoke the dataviz skill for this one — M3's LineChart pass already internalized the spec and this reuses it directly, per the skill's own note that this keeps the M3/M4/M5 charts "read[ing] as one system."
- [x] `/progress` page (`features/progress/components/ProgressScreen.tsx` + `RhythmChart`, `StrengthPerExerciseChart`, `SessionHistoryList`): two stat tiles, rhythm bar chart, exercise select + line chart (empty state below 2 points), paginated history list (`SessionHistoryList`) with strength/cardio badge rows linking to `/sessions/[id]` — reuses `StrengthIcon`/`CardioIcon`, moved to `shared/ui/icons.tsx` in this milestone since they were previously private to `QuickStartButton`/`LogCardioButton` and this is the third place that needed them. Top-level "No data yet." empty state when `totalSessions === 0`.

**Verified for M4**: `tsc --noEmit` clean, `npx convex dev --once` clean, `npx convex run` sanity checks (`getTotalSessionsCount`, `listRecentSessions`, `weeklyRhythm`, `strengthPerExercise` all degrade gracefully unauthenticated), curl smoke test on `/progress` (307→`/login`, no 500). Browser click-through (same scratch-Playwright approach as M3): signed up a fresh account, logged two Bench Press sessions (70kg→80kg) plus one Running cardio session, then confirmed on `/progress` — correct stat tiles (2/2), rhythm bar chart with the current week correctly highlighted and labeled, the strength-per-exercise line chart showing both points with an "80 kg" end label, and the history list showing a blue dumbbell badge on the strength row vs. an orange heart-rate badge on the cardio row (checked via a cropped screenshot after an initial full-page shot made the two look identical due to the fixed bottom-nav duplicating in a full-page capture — not a real bug, just a screenshot artifact). Zero console errors.

### M5 — Statistics tab ⬜
- [ ] `convex/stats.ts`: `getWeekSets`, `getWeekMuscleLoad` (both: one week-bounded scan + `aggregateLoad`), `getWeekTrends` (this vs last week: workouts/duration/volume/sets + 6-axis broad-group data), `getTargets`, `setTarget` (upsert one `{group,min,max}` row).
- [ ] `shared/charts/RadarChart.tsx`.
- [ ] `/stats` page, 3 sub-tabs with week nav (prev/next, clamped to current week):
  - **Sets**: total sets/reps tiles, per-broad-group cards (9 groups, fixed order) with status pill (Under/On track/Over), progress bar, "Edit target" dialog.
  - **Body**: `BodyMap` in `"load"` mode (week-scoped) + flat list of all 19 fine-grained muscles' set counts.
  - **Trends**: radar chart (current vs previous week, 6 axes: Back/Chest/Core/Shoulders/Legs/Arms) + 4 trend tiles (Workouts/Duration/Volume/Sets) with up/down arrows.

### M6 — Polish ⬜
- [ ] Responsive breakpoints verified at 768px/1000px (nav pill, sheet-vs-modal, routine grid) against actual rendered output, not just class names.
- [ ] Back-button-closes-sheet: push a no-op history entry on sheet open, close the top sheet on `popstate`.
- [ ] `loading.tsx` skeletons audited per route (some are placeholder text only right now).
- [ ] Empty states audited against the full spec (no folders/custom exercises yet, zero-history exercise, single-session routine, brand-new user with nothing logged).
- [ ] Tailwind lint suggestions cleanup (IDE has been flagging `px-[13px]` → `px-3.25` style canonical-class warnings throughout — cosmetic, non-blocking, worth a pass).
- [ ] Full click-through pass of M5 once built (M3 and M4's passes only exercised M0–M4 surfaces).

---

## How to resume

1. Read this file, then skim `docs/architecture.md` for the rules being followed.
2. Check what's running: `lsof -i -P -n | grep LISTEN` (dev server) and `npx convex dev --once` (push any pending backend changes, catches errors fast). If a browser screenshot ever looks unstyled, restart the dev server first (see the stale-Turbopack-CSS gotcha in Environment facts) before assuming it's a code bug.
3. Pick up at M5 (next unchecked milestone) unless told otherwise.
4. After each milestone: `npx tsc --noEmit`, `npx convex dev --once`, curl-smoke-test any new routes, and drive it in a real browser (Playwright in a scratch dir — see Environment facts).
