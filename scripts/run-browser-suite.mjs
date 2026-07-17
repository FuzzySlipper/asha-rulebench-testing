import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { materializeProduct, repositoryRoot, run } from "./product-worktree.mjs";

const checkout = materializeProduct("asha-rulebench");
run("pnpm", ["install", "--frozen-lockfile"], { cwd: checkout });
if (process.env.CI === "true") {
  run("pnpm", ["exec", "playwright", "install", "--with-deps", "chromium"], { cwd: checkout });
}
const destination = join(checkout, "apps", "app-e2e", "src", "downstream-certification");
mkdirSync(destination, { recursive: true });
for (const source of ["capability-manifest.spec.ts", "live-rust.exhaustive.spec.ts"]) {
  copyFileSync(join(repositoryRoot, "suites", "browser", source), join(destination, source));
}
run(
  "pnpm",
  [
    "exec",
    "playwright",
    "test",
    "--config",
    "apps/app-e2e/playwright.config.mts",
    "downstream-certification",
  ],
  { cwd: checkout, env: { ...process.env, RULEBENCH_EPHEMERAL_ARTIFACTS: "1" } },
);
