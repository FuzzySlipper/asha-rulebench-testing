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
  'docs/extraction-evidence.md',
  'governance/architecture.md',
  'governance/ownership.toml',
  'governance/dependency-policy.toml',
  'Cargo.toml',
  'suites/rulebench-proof/Cargo.toml',
  'suites/rulebench-proof/src/bin/check_compatibility.rs',
  'suites/browser/capability-manifest.spec.ts',
  'suites/browser/live-rust.exhaustive.spec.ts',
  'suites/typescript-fixtures/src/ruleset-authoring.spec.ts',
  'scripts/certify.mjs',
  'scripts/check-generated.mjs',
  '.github/workflows/certification.yml',
  'baselines/pre-move-certification-14d239f.json',
  'baselines/post-move-certification-8f12dfb.json',
  'artifacts/generated/rust-capability-manifest.ts',
  'artifacts/generated/rust-combat-session.ts',
  'artifacts/generated/rust-scenario-catalog.ts',
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

const cargoManifest = read('Cargo.toml');
if (/\bpath\s*=|\/home\/dev|\.\.\/asha-/.test(cargoManifest)) {
  failures.push('Cargo manifest may not depend on sibling or absolute source paths');
}
for (const [name, input] of Object.entries(revisions.products)) {
  const expectedUrl = `https://github.com/${input.repository}.git`;
  if (!cargoManifest.includes(expectedUrl)) {
    failures.push(`Cargo manifest does not consume the canonical ${name} repository`);
  }
  if (!cargoManifest.includes(`rev = "${input.revision}"`)) {
    failures.push(`Cargo manifest does not consume the exact ${name} revision`);
  }
}

const ownership = read('governance/ownership.toml');
if (ownership.includes('implementation_status = "planned"')) {
  failures.push('active certification surfaces may not remain marked planned');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('asha-rulebench-testing governance check ok (exact public pins; self-check only)');

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}
