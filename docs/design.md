# Asha Rulebench Testing design

## Purpose

This repository owns future exhaustive evidence that crosses Asha RPG and
Rulebench ownership. It consumes pinned public revisions and routes failures to
the first incorrect public owner contract. Neither product consumes or waits on
this repository for ordinary changes.

## Current phase

There is no active certification suite after #5952. The prototype suite was
deleted instead of migrated because its named content, implicit rulesets,
mirrored authority, persistence formats, replay claims, and generated artifacts
were all coupled to architecture that no longer exists.

The next suite must begin from fresh public contracts:

```text
explicit ruleset manifest
  -> closed compiled artifact (#5953)
  -> persistent authority workflow (#5955)
  -> pinned downstream certification
```

Until those contracts exist, there are no product pins or suite cells and no
certification command. The governance check is not certification.
