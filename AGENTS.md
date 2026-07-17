# AGENTS.md

## Den guidance bootstrap

- Project ID: `asha-rulebench-testing`
- Resolve live guidance with Den MCP `get_agent_guidance` before substantial work.
- Den owns current tasks, failure routing, review packets, and known limitations.
- If Den is unreachable, stop and report the failed tool and intended action.

## Repository role

This is a downstream proof consumer. It may consume pinned public revisions or
published artifacts from `asha-rpg` and `asha-rulebench`. Neither product may
import this repository or wait for it as an ordinary per-change gate.

Keep focused owner-local unit/regression tests in their product repositories.
Keep primary Rulebench user workflows in Rulebench. Move synthetic,
cross-package, cross-version, exhaustive, compatibility, certification, and
proof-shaped evidence here.

A failing suite is a signal routed to the owning product; this repository does
not become semantic authority and must not patch through private source paths.

## Commands

```bash
npm test
```

Do not call a planned or skipped suite passed. Use exact execution states and
record product revisions with every certification receipt.
