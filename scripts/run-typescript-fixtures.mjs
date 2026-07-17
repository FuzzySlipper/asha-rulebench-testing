import { cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { materializeProduct, repositoryRoot, run } from "./product-worktree.mjs";

const checkout = materializeProduct("asha-rulebench");
run("pnpm", ["install", "--frozen-lockfile"], { cwd: checkout });
const destination = join(checkout, "libs", "downstream-certification");
mkdirSync(destination, { recursive: true });
cpSync(join(repositoryRoot, "suites", "typescript-fixtures", "src"), destination, {
  recursive: true,
});
run("pnpm", ["exec", "vitest", "run", "libs/downstream-certification"], { cwd: checkout });
