# Memory Bank Rules

## Purpose

The memory bank is a concise, maintained reference for the HealthCore project. Use it to carry verified progress, decisions, file locations, and reusable student lessons across implementation sessions.

## Before implementation

1. Read `memory-bank/progress.md` and note its latest status, decisions, and next steps.
2. Use `memory-bank/project-structure.md` to find the relevant area, then read that area's README and applicable project instructions.
3. Check `memory-bank/lessons/` for a relevant implementation or lesson before repeating prior work.
4. Treat the source files and their tests as authoritative if the memory bank is stale or disagrees with the code.

## Updating progress

- Add a dated entry to `memory-bank/progress.md` when meaningful implementation, verification, or a project decision is completed.
- Record the scope, files or components affected, outcome, checks run and their results, decisions made, and concrete next steps.
- Keep earlier entries as historical reference. Do not rewrite history to make unfinished work appear complete.
- Distinguish verified facts from proposals, assumptions, and work not yet started. Never claim a check passed unless it was run.
- Keep secrets and patient-identifying or other sensitive data out of the memory bank. Summarize safely instead.

## Updating the project map

- Update `memory-bank/project-structure.md` when project areas, important entry points, or ownership paths change.
- Keep it a navigational index, not a duplicate of every folder README or a listing of every file.
- Link to paths that exist and describe their purpose briefly.

## Adding lessons

- Add lessons under `memory-bank/lessons/` after an implementation provides a reusable learning outcome or reference.
- Organize lessons by project or milestone where practical. Include the problem, approach, important files, verification, and tradeoffs; link to implementation files rather than copying large code blocks.
- Label incomplete or illustrative examples clearly, and do not present a proposal as a working implementation.

## General

- Keep entries concise, specific, and useful to both students and future contributors.
- Follow repository guidance and relevant directory READMEs. The memory bank does not override them.