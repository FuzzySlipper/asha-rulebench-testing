import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

export function loadRevisions() {
  return JSON.parse(readFileSync(join(repositoryRoot, "revisions.json"), "utf8"));
}

export function materializeProduct(name) {
  const input = loadRevisions().products?.[name];
  if (input === undefined) throw new Error(`Unknown pinned product: ${name}`);
  const checkout = join(repositoryRoot, ".cache", "products", `${name}-${input.revision}`);
  if (!existsSync(checkout)) {
    mkdirSync(dirname(checkout), { recursive: true });
    execFileSync(
      "git",
      ["clone", "--no-checkout", `https://github.com/${input.repository}.git`, checkout],
      { stdio: "inherit" },
    );
    execFileSync("git", ["-C", checkout, "checkout", "--detach", input.revision], {
      stdio: "inherit",
    });
  }
  const head = execFileSync("git", ["-C", checkout, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const origin = execFileSync("git", ["-C", checkout, "remote", "get-url", "origin"], {
    encoding: "utf8",
  }).trim();
  if (head !== input.revision) {
    throw new Error(`${name} checkout is at ${head}; expected ${input.revision}`);
  }
  if (!origin.endsWith(`/${input.repository}.git`)) {
    throw new Error(`${name} checkout origin is ${origin}; expected ${input.repository}`);
  }
  return checkout;
}

export function run(command, argumentsList, options = {}) {
  execFileSync(command, argumentsList, { stdio: "inherit", ...options });
}

export { repositoryRoot };
