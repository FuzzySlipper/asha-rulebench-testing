import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'AGENTS.md',
  'README.md',
  'revisions.json',
  'docs/design.md',
  'docs/certification-policy.md',
  'docs/failure-routing.md',
  'docs/non-claims.md',
  'governance/architecture.md',
  'governance/ownership.toml',
  'governance/dependency-policy.toml',
];

const failures = [];
for (const path of requiredFiles) {
  if (!existsSync(join(root, path))) failures.push(`missing required file: ${path}`);
}

const revisions = JSON.parse(read('revisions.json'));
const expectedRepositories = {
  'asha-rpg': 'FuzzySlipper/asha-rpg',
  'asha-rulebench': 'FuzzySlipper/asha-rulebench',
};
for (const [name, repository] of Object.entries(expectedRepositories)) {
  const input = revisions.products?.[name];
  if (input?.repository !== repository) failures.push(`unexpected repository for ${name}`);
  if (!/^[0-9a-f]{40}$/.test(input?.revision ?? '')) failures.push(`${name} revision must be a full Git SHA`);
}

const policy = read('governance/dependency-policy.toml');
for (const contract of [
  'ordinary_product_per_change_gate = false',
  'runtime_dependency = false',
  'allow_private_source_imports = false',
]) {
  if (!policy.includes(contract)) failures.push(`dependency policy is missing: ${contract}`);
}

const packageJson = read('package.json');
if (/file:\.\.|\/home\/dev/.test(packageJson)) failures.push('package manifest may not depend on sibling source paths');

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('asha-rulebench-testing governance check ok (bootstrap only; no certification claimed)');

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}
