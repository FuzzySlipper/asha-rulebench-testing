import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'AGENTS.md',
  'README.md',
  'package.json',
  'docs/design.md',
  'docs/failure-routing.md',
  'docs/non-claims.md',
  'governance/architecture.md',
  'governance/ownership.toml',
  'governance/dependency-policy.toml',
];
const retiredPrototypeSurfaces = [
  '.github/workflows/certification.yml',
  'Cargo.toml',
  'revisions.json',
  'artifacts/generated',
  'artifacts/receipts',
  'baselines',
  'suites',
  'scripts/certify.mjs',
];

const failures = [];
for (const path of requiredFiles) {
  if (!existsSync(join(root, path))) failures.push(`missing required file: ${path}`);
}
for (const path of retiredPrototypeSurfaces) {
  if (existsSync(join(root, path))) failures.push(`retired prototype surface remains: ${path}`);
}

const policy = read('governance/dependency-policy.toml');
for (const contract of [
  'ordinary_product_per_change_gate = false',
  'runtime_dependency = false',
  'allow_private_source_imports = false',
]) {
  if (!policy.includes(contract)) {
    failures.push(`dependency policy is missing: ${contract}`);
  }
}

const packageJson = JSON.parse(read('package.json'));
const scriptNames = Object.keys(packageJson.scripts ?? {}).sort();
if (JSON.stringify(scriptNames) !== JSON.stringify(['check:governance', 'test'])) {
  failures.push('only the non-certifying governance scripts may exist in the empty harness');
}
if (/file:\.\.|\/home\/dev/.test(JSON.stringify(packageJson))) {
  failures.push('package manifest may not depend on sibling source paths');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('asha-rulebench-testing empty-harness governance ok (not certification)');

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}
