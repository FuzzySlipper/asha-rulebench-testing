import { repositoryRoot, run } from "./product-worktree.mjs";

run("cargo", ["test", "--manifest-path", `${repositoryRoot}/Cargo.toml`]);
run("cargo", [
  "run",
  "--quiet",
  "--manifest-path",
  `${repositoryRoot}/Cargo.toml`,
  "-p",
  "rulebench-proof",
  "--bin",
  "check_regressions",
]);
