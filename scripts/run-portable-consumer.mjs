import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { materializeProduct, run } from "./product-worktree.mjs";

const checkout = materializeProduct("asha-rpg");
const manifest = join(checkout, "consumers", "minimal-game", "Cargo.toml");
const revision = checkout.slice(checkout.lastIndexOf("-") + 1);
const source = readFileSync(manifest, "utf8");
const pinned = source.replace(/rev = "[0-9a-f]{40}"/, `rev = "${revision}"`);
if (pinned === source && !source.includes(`rev = "${revision}"`)) {
  throw new Error("minimal consumer manifest does not expose one exact public revision");
}
writeFileSync(manifest, pinned);
run("cargo", ["update", "--manifest-path", manifest, "-p", "asha-rpg"]);
run("cargo", ["test", "--manifest-path", manifest]);
