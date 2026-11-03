const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createProject, findTemplate, toPackageName } = require('../lib/cli');

const CLI = path.join(__dirname, '..', 'lib', 'cli.js');
let workspace;

before(() => {
  workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'cens-cli-'));
});
after(() => fs.rmSync(workspace, { recursive: true, force: true }));

const create = (name, template) =>
  createProject({
    directory: path.join(workspace, name),
    template,
    install: false,
    git: false,
  });

const read = (...parts) => fs.readFileSync(path.join(...parts), 'utf8');

/** Run the CLI with arguments and optional piped input. */
const cli = (args, input = '') =>
  spawnSync(process.execPath, [CLI, ...args], {
    cwd: workspace,
    input,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
  });

test('every template creates a named project with a .gitignore and a .env', () => {
  for (const id of ['basic', 'product', 'auth']) {
    const { target, name } = create(`app-${id}`, id);
    assert.equal(name, `app-${id}`);
    assert.equal(JSON.parse(read(target, 'package.json')).name, `app-${id}`);
    assert.ok(fs.existsSync(path.join(target, '.gitignore')));
    assert.ok(!fs.existsSync(path.join(target, 'gitignore')));
    assert.match(
      read(target, '.env'),
      new RegExp(`DEV_DATABASE=.*/app-${id}\n`),
    );
    assert.ok(read(target, 'README.md').startsWith(`# app-${id}\n`));
    assert.match(read(target, 'src/app.js'), new RegExp(`name: 'app-${id}'`));
    const spec = JSON.parse(read(target, 'src/swagger.json'));
    assert.equal(spec.info.title, `app-${id}`);

    const files = fs.readdirSync(target, { recursive: true });
    for (const file of files) {
      const full = path.join(target, file);
      if (fs.statSync(full).isFile()) {
        assert.ok(!read(full).includes('{{projectName}}'), file);
      }
    }
  }
});

test('the auth template gets its own random secret', () => {
  const secretOf = (target) => /^SECRET=(.*)$/m.exec(read(target, '.env'))[1];
  const first = secretOf(create('secret-1', 'auth').target);
  const second = secretOf(create('secret-2', 'auth').target);
  assert.match(first, /^[0-9a-f]{96}$/);
  assert.notEqual(first, second);
  assert.match(
    read(workspace, 'secret-1', '.env.example'),
    /^SECRET=$/m,
    '.env.example must never hold a secret',
  );
});

test('templates without users have no authentication code', () => {
  for (const id of ['basic', 'product']) {
    const { target } = create(`noauth-${id}`, id);
    const pkg = JSON.parse(read(target, 'package.json'));
    assert.equal(pkg.dependencies.jsonwebtoken, undefined);
    assert.ok(
      !fs.existsSync(path.join(target, 'src/middlewares/verify-token.js')),
    );
    assert.doesNotMatch(read(target, '.env.example'), /SECRET/);
  }
});

test('a directory that is not empty is never overwritten', () => {
  const target = path.join(workspace, 'busy');
  fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, 'keep.txt'), 'mine');
  assert.throws(() => create('busy', 'basic'), /not empty/);
  assert.deepEqual(fs.readdirSync(target), ['keep.txt']);
});

test('templates are found by id, number or folder name', () => {
  assert.equal(findTemplate('auth').directory, 'user-crud-authentification');
  assert.equal(findTemplate('2').id, 'product');
  assert.equal(findTemplate('basic-project').id, 'basic');
  assert.throws(() => findTemplate('nope'), /Unknown template/);
  assert.throws(() => findTemplate('4'), /Unknown template/);
});

test('project names are safe for npm and MongoDB', () => {
  assert.equal(toPackageName('My Shop.API'), 'my-shop-api');
  assert.equal(toPackageName('./apps/orders'), 'orders');
  assert.throws(() => toPackageName('...'), /project name/);
});

test('--help and --version print and exit', () => {
  const help = cli(['--help']);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /--template <name>/);
  const version = cli(['--version']);
  assert.equal(version.stdout.trim(), require('../package.json').version);
});

test('flags create a project without any prompt', () => {
  const run = cli([
    'flags-app',
    '--template',
    'product',
    '--no-install',
    '--no-git',
  ]);
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /Product CRUD/);
  assert.match(run.stdout, /cd flags-app\n\s+npm install\n\s+npm run dev/);
  assert.ok(
    fs.existsSync(
      path.join(workspace, 'flags-app/src/models/product.model.js'),
    ),
  );
});

test('answers can be piped to the prompts', () => {
  const run = cli(['--no-install', '--no-git'], 'piped-app\n3\n');
  assert.equal(run.status, 0, run.stderr);
  assert.ok(
    fs.existsSync(path.join(workspace, 'piped-app/src/models/user.model.js')),
  );
});

test('a wrong template fails with a clear message and creates nothing', () => {
  const run = cli(['bad-app', '-t', 'graphql', '--no-install', '--no-git']);
  assert.equal(run.status, 1);
  assert.match(run.stderr, /Unknown template "graphql"/);
  assert.ok(!fs.existsSync(path.join(workspace, 'bad-app')));
});
