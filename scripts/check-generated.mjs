import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { repositoryRoot } from "./product-worktree.mjs";

const outputs = [
  ["emit_scenario_catalog", "rust-scenario-catalog.ts"],
  ["emit_combat_session", "rust-combat-session.ts"],
  ["emit_capability_manifest", "rust-capability-manifest.ts"],
];

for (const [binary, artifact] of outputs) {
  const rendered = execFileSync(
    "cargo",
    [
      "run",
      "--quiet",
      "--manifest-path",
      join(repositoryRoot, "Cargo.toml"),
      "-p",
      "rulebench-proof",
      "--bin",
      binary,
    ],
    { encoding: "utf8" },
  );
  const artifactPath = join(repositoryRoot, "artifacts", "generated", artifact);
  if (process.argv.includes("--write")) {
    writeFileSync(artifactPath, rendered);
    console.log(`wrote ${artifact}`);
    continue;
  }
  const committed = readFileSync(artifactPath, "utf8");
  if (rendered !== committed) {
    console.error(`${artifact} differs from ${binary} output`);
    process.exit(1);
  }
}

if (!process.argv.includes("--write")) {
  console.log(`downstream generated proof artifacts match (${outputs.length} emitters)`);
}
