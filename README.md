# asha-rulebench-testing

`asha-rulebench-testing` is the downstream exhaustive proof consumer for
`asha-rpg` and `asha-rulebench`. It owns cross-repository conformance,
compatibility, replay/golden matrices, unseen-content certification, exhaustive
browser/live-host journeys, and milestone/release receipts.

It is never a runtime dependency or an ordinary per-change gate of either
product repository. Product repositories keep focused owner-local regressions
and Rulebench keeps its primary visible user journeys.

## Bootstrap status

Task #5940 establishes governance and exact product pins. No proof corpus is
claimed here yet. Task #5942 will first record the Rulebench pre-move baseline,
then move and execute the selected exhaustive suites against pinned product
revisions. Planned suite cells are explicitly marked `planned` in the ownership
map.

## Check

```bash
npm test
```

This bootstrap check validates repository direction, required governance, and
full-SHA product pins. It is not certification.
