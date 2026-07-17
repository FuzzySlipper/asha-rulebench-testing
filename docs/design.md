# Asha Rulebench Testing design

## Purpose

Asha Rulebench Testing is the downstream repository for exhaustive evidence
that crosses product or package ownership. It consumes public, pinned revisions
of Asha RPG and Rulebench and reports failures to the responsible owner.

## Dependency direction

```text
asha-engine public APIs
          |
          v
      asha-rpg -----> asha-rulebench
          \               /
           \             /
            v           v
          asha-rulebench-testing
```

There are no reverse arrows. Testing is neither runtime code nor a required
remote check for ordinary product changes.

## Owned evidence

This repository owns:

- semantic fixture and scenario corpora that are synthetic or exhaustive;
- replay/golden and cross-version compatibility matrices;
- cross-host and public-consumer conformance;
- unseen-content and portable-consumer certification;
- exhaustive deterministic browser and live-host journeys;
- certification claims, limitations, and inspected evidence receipts;
- proof-only experiment matrices.

Asha RPG retains focused semantic owner tests. Rulebench retains host/product
regressions and primary visible workflows. The testing repo must not duplicate
their ordinary per-change suites.

## Product consumption

`revisions.json` pins full Git SHAs. A certification run checks out or consumes
artifacts for those exact revisions, validates public boundaries, and records
the same revisions in its receipt. Local sibling paths are development
conveniences only if a command first verifies that their HEAD equals the pin;
they are never the dependency contract.

## Cadence

- Per-change CI in this repository validates its own harness and boundaries.
- Nightly runs execute the retained deterministic corpus.
- Manual runs support investigation and compatibility changes.
- Milestone/release runs use explicit live prerequisites and inspected artifacts.
- Product repositories do not synchronously wait for these runs by default.

The nightly/manual certification workflow is introduced with the runnable suite
in #5942. This bootstrap deliberately does not publish an empty green
certification workflow.

## Result language

A suite result is `passed`, `failed`, `not_run`, `unavailable`, or `stale`.
Only an executed current result may be `passed`. A repository/bootstrap check
is not a semantic certification receipt.
