# Downloads root — multi-project workspace

This directory is **not a single project**. It's a Downloads folder containing many
unrelated repos/projects side by side (see subfolders). Do not glob/grep the whole
tree by default — scope to the relevant subfolder first.

## Token-saving rules for this workspace

1. **Ask or infer the target subfolder before searching broadly.** If the user names
   a project (e.g. "Clark MSB", "N8DEV", "AIWS"), `cd`/scope tools into that folder
   immediately rather than searching from the root.
2. **Never traverse these** (large, irrelevant, or generated — already in
   `.claude/settings.json` ignorePatterns, but avoid explicitly targeting them too):
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
`omni-architect-os/`, `scripts/`, `workflows/`

When starting work, confirm which of these (or a new path) is in scope rather than
scanning all of them.
