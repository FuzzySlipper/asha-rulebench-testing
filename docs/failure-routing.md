# Failure Routing

When fresh downstream suites are introduced:

- Asha RPG compiler/runtime failures route to `asha-rpg`.
- Rulebench artifact-selection, transport, or UI failures route to
  `asha-rulebench`.
- Harness, pinning, receipt, or matrix failures route here.

No active suite currently produces certification failures.
