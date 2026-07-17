import { readFileSync } from "node:fs";
import { join } from "node:path";
import { materializeProduct } from "./product-worktree.mjs";

for (const product of ["asha-rpg", "asha-rulebench"]) {
  const checkout = materializeProduct(product);
  for (const manifest of ["Cargo.toml", "package.json"]) {
    let source;
    try {
      source = readFileSync(join(checkout, manifest), "utf8");
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      throw error;
    }
    if (source.includes("asha-rulebench-testing")) {
      throw new Error(`${product}/${manifest} has a forbidden reverse dependency on testing`);
    }
  }
}

console.log("product dependency direction ok (no testing reverse dependency)");
