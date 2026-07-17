# Rulebench Proof Extraction Evidence

## Pre-move baseline

Rulebench revision `14d239f9df441470b66e1abab33aa6f6b3bb1247`
passed `pnpm run certify` before extraction. The captured baseline records:

- 11 scenario regressions;
- 16 capability-conformance cases covering 14 semantic capabilities;
- 23 deterministic browser tests;
- authored-content compatibility readers v1 through v4 and replay storage v1;
- no managed live-artifact claim.

The source receipt and normalized baseline are committed under `baselines/`.

## Post-move comparison

The downstream suite consumes exact public revisions:

- `asha-rpg` `ea3e3803d4736268f2a10996a34bc5b8dfefcffc`;
- `asha-rulebench` `8f12dfb51542c0b61d257f6ce8d34b3573ad1019`.

On 2026-07-17, `npm run certify` passed every owned cell:

- 302 exhaustive Rust harness tests;
- the same 11 scenario regressions and 16 conformance cases covering the same
  14 capabilities and fingerprints;
- three generated proof-artifact comparisons;
- authored-content v1-v4 and replay-storage v1 compatibility;
- four TypeScript fixture/authoring tests;
- the independent minimal RPG consumer after repinning it to the exact RPG
  revision;
- 15 relocated exhaustive browser tests.

Rulebench retained eight primary `@gate` browser journeys at the pinned product
revision. The 15 downstream plus eight product journeys equal the 23-test
pre-move browser baseline; no browser test was silently discarded.

The generated receipt records all cells as `passed` and explicitly does not
claim managed LAN visual inspection, semantic authority for this repository,
or an ordinary product per-change gate.
