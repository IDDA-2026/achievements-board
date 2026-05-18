# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

Open `index.html` directly in a browser — no build step, no server, no dependencies. The page loads `data.js` as a plain `<script>` tag before `app.js`, so `LEADERBOARD_DATA` is a global constant by the time the app boots.

To reset notification state during testing: DevTools → Application → Local Storage → delete `idda_leaderboard_seen`.

## Architecture

Three files that each have a clear, distinct role:

- **`data.js`** — the only file instructors should ever need to edit. Exports a single global `LEADERBOARD_DATA` object with three keys: `meta`, `achievements`, and `players`.
- **`app.js`** — reads `LEADERBOARD_DATA` on `DOMContentLoaded`, computes derived state (scores, ranks, unseen notifications), and renders everything via DOM string injection.
- **`styles.css`** — all visual styles; CSS custom properties in `:root` control the colour palette.

### Key constants in app.js

| Constant | Purpose |
|---|---|
| `RANK_TITLES` | Point thresholds → auto-title strings |
| `TOAST_DURATION` | How long (ms) a toast stays on screen |
| `LS_KEY` (`idda_leaderboard_seen`) | localStorage key for notification read state |

### Score computation

`computeRankedPlayers()` maps each player's `earnedAchievements` array through `achievementsMap` (built from `LEADERBOARD_DATA.achievements`), sums points, sorts descending, then assigns a `rank` property using standard competition ranking (ties share the same rank number). Achievements with an unrecognised `id` are silently dropped. Tiebreaker: alphabetical by name (`localeCompare`).

### Ranking and podium rules

- **Tie at #1**: the podium section is hidden entirely; only the full ranked list is shown.
- **Tie at #2**: podium shows #1 in the centre with both tied #2 players flanking left and right.
- **Normal**: podium shows 2nd · 1st · 3rd.
- The ranked list always shows the computed rank number (tied players show the same rank).

### Notification system

A notification key is `"playerId:achievementId"`. On load, any key not already in `localStorage` is "unseen". Up to 5 toasts show at once; the queue drains as each toast exits. The bell badge shows the total unseen count and is hidden when the count is 0.

### Achievements catalog modal

The "Achievements" button in the header opens a modal listing every achievement with icon, name, rarity, points, and description. Achievements with `locked: true` in `data.js` render with a padlock overlay and dimmed appearance — they are visible in the catalog but not yet earnable. To unlock a locked achievement: remove `locked: true` from the achievement entry. This modal is separate from the per-player modal (opened by clicking a player card).

### CSS `[hidden]` override fix

Several elements use `display: flex` in CSS, which overrides the browser's UA `[hidden] { display: none }`. Wherever this applies, a matching `element[hidden] { display: none }` rule is added in `styles.css`. Affected elements: `.notif-panel`, `.notif-count`, `.modal-overlay`.

## Editing data.js

**Add a player** — append to the `players` array. `id` should match the avatar filename (without extension). `title: ""` triggers auto-title from `RANK_TITLES`. Use `"avatars/default.png"` when no personal photo is available.

**Unlock an achievement for a player** — add `{ id: "<achievement_id>", earnedAt: "YYYY-MM-DD" }` to the player's `earnedAchievements`. The `id` must exist in the `achievements` array or the entry is ignored.

**Add an achievement** — append to the `achievements` array. Valid rarities: `common | uncommon | rare | epic | legendary`. Add `locked: true` to show it in the catalog as coming soon without making it earnable yet.

**Lock / unlock an achievement** — set or remove `locked: true` on the achievement object. Locked achievements show a padlock in the catalog and cannot be earned until unlocked.

**Add weekly labs achievement** — follow the `labs_week_may18` pattern: one achievement per week, `locked: true` until the week ends, then remove the flag and assign it to students who delivered.

**Change cohort name/subtitle** — edit the `meta` object at the top of `data.js`.

## Current achievements

| ID | Name | Points | Rarity | Status |
|---|---|---|---|---|
| `on_time` | On Time | 100 | uncommon | active |
| `bonus_lab_1` | Bonus Lab 1: HTML Dashboard | 500 | epic | active |
| `labs_week_may18` | Week of May 18 — Labs Delivered | 200 | rare | locked |

## Avatars

Player photos live in `avatars/`. Filename must match the player `id` (e.g. `avatars/yusif.png`). Players without a photo use `avatars/default.png`.
