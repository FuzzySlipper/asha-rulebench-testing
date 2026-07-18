# AGENTS.md

## Den guidance bootstrap

- Project ID: `asha-rulebench-testing`
- Resolve live guidance with Den MCP `get_agent_guidance` before substantial
  work.
- Den owns current tasks, failure routing, review packets, and limitations.
- If Den is unreachable, stop and report the failed tool and intended action.

## Repository role

This is the downstream proof consumer for pinned public `asha-rpg` and
`asha-rulebench` revisions. It is never a runtime dependency or ordinary
per-change gate.

The prototype certification corpus was deliberately removed by Rulebench task
#5952. Do not restore named content, old generated artifacts, compatibility
fixtures, replay expectations, pins, or a green placeholder certification.
Fresh suites must consume the compiled-artifact and persistent-authority
surfaces delivered by #5953/#5955.

## Command

```bash
npm test
```

This checks repository governance only. It is not certification.
