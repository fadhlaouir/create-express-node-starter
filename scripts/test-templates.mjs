#!/usr/bin/env node
// Creates a project from each template exactly as users get it, installs it,
// then runs its tests, linter and format check:
//
//   npm run test:templates            all templates
//   npm run test:templates -- auth    one template

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { TEMPLATES, createProject, findTemplate } = require('../lib/cli.js');

const selected = process.argv[2] ? [findTemplate(process.argv[2])] : TEMPLATES;
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'cens-'));
const failures = [];

for (const template of selected) {
  console.log(`\n▶ ${template.name}`);
  const directory = path.join(workspace, `test-${template.id}`);
  const { installed } = createProject({
    directory,
    template: template.id,
    git: false,
  });
  if (!installed) {
    failures.push(`${template.id}: npm install`);
    continue;
  }
  for (const script of ['test', 'lint', 'format:check']) {
    const result = spawnSync('npm', ['run', script], {
      cwd: directory,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    if (result.status !== 0) failures.push(`${template.id}: npm run ${script}`);
  }
}

fs.rmSync(workspace, { recursive: true, force: true });

if (failures.length) {
  console.error(`\n✖ Failed:\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(
  `\n✔ ${selected.length} template(s) pass their tests, lint and format check`,
);
