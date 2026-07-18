# asha-rulebench-testing

`asha-rulebench-testing` is the downstream home for future exhaustive,
cross-repository evidence over pinned public Asha RPG and Rulebench revisions.

The old prototype corpus, generated proof artifacts, compatibility/replay
fixtures, baselines, product pins, certification runner, and scheduled workflow
were removed under Rulebench task #5952. Preserving them would keep deleted
content architecturally authoritative.

The repository is intentionally between suites. It does not report an empty
certification as passed. Fresh certification work begins only after #5953 and
#5955 expose the explicit compiled-artifact and persistent-authority contracts.

```bash
npm test
```

`npm test` validates this repository's dependency-direction and empty-harness
governance. It is not semantic, compatibility, browser, replay, or milestone
certification.
