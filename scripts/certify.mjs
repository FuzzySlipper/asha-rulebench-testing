import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadRevisions, repositoryRoot } from "./product-worktree.mjs";

const suites = [
  ["governance", "node", ["scripts/check-governance.mjs"]],
  ["dependencyDirection", "node", ["scripts/check-product-direction.mjs"]],
  ["semantic", "node", ["scripts/run-semantic.mjs"]],
  ["generatedProof", "node", ["scripts/check-generated.mjs"]],
  ["compatibility", "cargo", ["run", "--quiet", "-p", "rulebench-proof", "--bin", "check_compatibility"]],
  ["typescriptFixtures", "node", ["scripts/run-typescript-fixtures.mjs"]],
  ["portableConsumer", "node", ["scripts/run-portable-consumer.mjs"]],
  ["exhaustiveBrowser", "node", ["scripts/run-browser-suite.mjs"]],
];
const results = [];
for (const [id, command, argumentsList] of suites) {
  console.log(`\n[certify] ${id}: ${command} ${argumentsList.join(" ")}`);
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, argumentsList, { cwd: repositoryRoot, stdio: "inherit" });
  results.push({
    id,
    state: result.status === 0 ? "passed" : "failed",
    command: [command, ...argumentsList].join(" "),
    startedAt,
    exitCode: result.status,
  });
}

const receipt = {
  schema: "asha-rulebench-testing.certification-receipt",
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  cadence: process.env.CERTIFICATION_CADENCE ?? "manual",
  revisions: loadRevisions().products,
  suites: results,
  claims: [
    "Only suite cells recorded as passed completed against the exact pinned public revisions.",
    "The exhaustive browser cell is deterministic process-host evidence, not inspected managed LAN visual proof.",
  ],
  nonClaims: [
    "This receipt does not make asha-rulebench-testing semantic authority.",
    "This receipt does not make downstream certification an ordinary product per-change gate.",
    "Skipped, unavailable, stale, and failed cells are never reported as passed.",
  ],
  failureRouting: "docs/failure-routing.md",
};
const directory = join(repositoryRoot, "artifacts", "receipts");
mkdirSync(directory, { recursive: true });
const timestamp = receipt.generatedAt.replaceAll(":", "-");
const path = join(directory, `${timestamp}.json`);
writeFileSync(path, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(`\nCertification receipt: ${path}`);
if (results.some((result) => result.state !== "passed")) process.exit(1);
