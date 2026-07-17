# Certification policy

Every certification receipt records:

- exact `asha-rpg` and `asha-rulebench` revisions;
- suite and harness versions;
- selected cadence and reason;
- commands and environment prerequisites;
- executed, skipped, unavailable, stale, and failed surfaces;
- artifact paths and inspection status;
- explicit claims and non-claims;
- the owning repository for each failure.

Nightly and manual results are downstream signals. Milestone or release policy
may require a named certification run, but ordinary product per-change checks
must not invoke this repository remotely.

The nightly/manual workflow runs `npm run certify`. Each suite cell records
`passed` or `failed`; future optional cells must use `skipped`, `unavailable`,
or `stale` rather than collapsing those states into success. Receipts are local
workflow artifacts, not committed source.

Browser process exit is not visual proof. Live claims require the documented
host, current pins, collected artifacts, and human/agent inspection of rendered
results.
