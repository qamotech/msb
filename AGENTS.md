# Downloads root — multi-project workspace

This directory is **not a single project**. It's a Downloads folder containing many
unrelated repos/projects side by side (see subfolders). Do not glob/grep the whole
tree by default — scope to the relevant subfolder first.

## Token-saving rules for this workspace

1. **Ask or infer the target subfolder before searching broadly.** If the user names
   a project (e.g. "Clark MSB", "N8DEV", "AIWS"), `cd`/scope tools into that folder
   immediately rather than searching from the root.
2. **Never traverse these** (large, irrelevant, or generated — already in
   `.Codex/settings.json` ignorePatterns, but avoid explicitly targeting them too):
   `node_modules/`, `.git/`, `--REPOSITORIES--/`, `_ldetest/`, `.tmp.driveupload/`,
   `.playwright-mcp/`, `*.exe`, `temp*.js`.
3. **Prefer Glob/Grep with a `path` scoped to the subfolder** over an unscoped
   search from `C:\Users\qamel\Downloads`.
4. **Don't re-read files already read this session** — the harness tracks state;
   re-reading after an Edit/Write is redundant.
5. **Batch independent reads/searches** in one message instead of sequential
   round-trips.

## Known subfolders (top-level, non-exhaustive)
`1POLY/`, `AIWS/`, `AXIOM_CODE_AI_WORKSPACE/`, `Aether/`, `Clark MSB/`, `Codex/`,
`N8DEV/`, `context-hub/`, `n8sheetz-inspector/`, `n8sheetz-readability-inspector/`,
`omni-architect-os/`, `scratch/`, `scripts/`, `work/`, `workflows/`

When starting work, confirm which of these (or a new path) is in scope rather than
scanning all of them.

## Active Automation Engines
- **ContinuumOS** (`ContinuumOS.html` & `scripts/continuum_upgrade_runner.py`):
  Autonomous portfolio web app evolution and optimization engine. Scheduled background daemon runs every 10 minutes (`*/10 * * * *`), logging to `work/scheduled-projects/continuum-state.json` and `work/scheduled-projects/continuum-evolution.md`. Rollback backups reside in `scratch/continuum-backups/`. 26 active connected repositories (`npp`, `msb`, and `locmein` permanently excluded).

## User Preferences
- **Motion & Animations**: The user explicitly does **NOT** prefer reduced motion. Do not inject or enforce `@media (prefers-reduced-motion: reduce)` overrides or kill animations; preserve full, lively dynamic motion and smooth micro-animations across all projects.

