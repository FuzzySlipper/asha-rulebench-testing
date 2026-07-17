# asha-rulebench-testing

`asha-rulebench-testing` is the downstream exhaustive proof consumer for
`asha-rpg` and `asha-rulebench`. It owns cross-repository conformance,
compatibility, replay/golden matrices, unseen-content certification, exhaustive
browser/live-host journeys, and milestone/release receipts.

It is never a runtime dependency or an ordinary per-change gate of either
product repository. Product repositories keep focused owner-local regressions
and Rulebench keeps its primary visible user journeys.

## Commands

```bash
npm test
npm run test:semantic
npm run test:compatibility
npm run test:typescript
npm run test:portable
npm run test:browser
npm run certify
```

`npm test` validates this repository's own governance and exact pins. It is not
certification. `npm run certify` executes every owned suite and writes an honest
receipt under ignored `artifacts/receipts/`; any failed cell makes the command
fail and remains recorded as failed.

The committed pre-move Rulebench baseline is under `baselines/`. Generated
scenario/session/capability proof artifacts are committed under
`artifacts/generated/` and checked against the downstream Rust emitters.
The exact pre/post comparison is documented in
`docs/extraction-evidence.md`.
