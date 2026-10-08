# Project Structure

Navigational index for the HealthCore monorepo. Read the README in a project area before implementing there; this index is intentionally high-level.

## Root guidance and context

| Path | Purpose |
| --- | --- |
| [`AGENTS.md`](../AGENTS.md) | Agent entry point and memory-bank navigation |
| [`.agent/memory-bank-rules.md`](../.agent/memory-bank-rules.md) | Rules for reading and maintaining the memory bank |
| [`CONTEXT.md`](../CONTEXT.md) | HealthCore company domain, departments, needs, and constraints |
| [`healthcore-briefing.md`](../healthcore-briefing.md) | AI appointment-assistant project briefing |
| [`README.md`](../README.md) | Monorepo orientation and folder guide |

## Project areas

| Path | Responsibility |
| --- | --- |
| [`agents/`](../agents/) | AI agents; includes an agent template and tools |
| [`data/`](../data/) | Raw data, pipelines, processed data, and evaluation assets |
| [`docs/`](../docs/) | Cross-project architecture and engineering documentation |
| [`infra/`](../infra/) | Infrastructure and deployment resources |
| [`internal/`](../internal/) | Internal engineering tools |
| [`mcps/`](../mcps/) | Model Context Protocol servers and integrations |
| [`packages/`](../packages/) | Reusable packages; `packages/shared/` contains shared TypeScript types |
| [`scripts/`](../scripts/) | Operational and development scripts |
| [`services/`](../services/) | Backend APIs and background services |
| [`shared/`](../shared/) | Reusable assets that are not standalone packages |
| [`skills/`](../skills/) | Reusable agent capabilities, instructions, scripts, and resources |
| [`uis/`](../uis/) | User-facing applications and dashboards |
| [`workflows/`](../workflows/) | Automation and cross-system orchestration |

## Memory bank

| Path | Purpose |
| --- | --- |
| [`progress.md`](progress.md) | Dated history of verified progress, decisions, checks, and next steps |
| [`project-structure.md`](project-structure.md) | This navigational index |
| [`lessons/`](lessons/) | Student-facing lessons and references to project implementations |