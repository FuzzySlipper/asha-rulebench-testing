# Failure routing

Route failures by the first public contract that is wrong:

| Failure | Owner |
| --- | --- |
| RPG IR decode, semantic validation, authority event/state, SDK normalization | `asha-rpg` |
| Rulebench protocol, host, storage, migration, product workflow, UI mapping | `asha-rulebench` |
| Harness orchestration, pin resolution, fixture expectation, receipt generation | `asha-rulebench-testing` |
| Missing or broken public ASHA surface | upstream `asha-engine` task |

A testing failure must include exact revisions, the smallest reproducing command,
the observed public input/output, and the suspected owner. Do not tunnel into
private source or patch a product through a test-only adapter.
