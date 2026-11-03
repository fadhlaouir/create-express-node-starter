#!/usr/bin/env node
/* -------------------------------------------------------------------------- */
/*                                DEPENDENCIES                                */
/* -------------------------------------------------------------------------- */
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const { spawnSync } = require('node:child_process');
const { parseArgs, styleText } = require('node:util');

const { version } = require('../package.json');

/* -------------------------------------------------------------------------- */
/*                                  Templates                                 */
/* -------------------------------------------------------------------------- */
const TEMPLATES = [
  {
    id: 'basic',
    name: 'Basic Project 🌱',
    description: 'Express 5 and MongoDB, ready for your first endpoints',
    directory: 'basic-project',
  },
  {
    id: 'product',
    name: 'Product CRUD 🚀',
    description: 'A product API with search, pagination and photo uploads',
    directory: 'product-crud',
  },
  {
    id: 'auth',
    name: 'Full Stack User Authentication 🔒',
    description: 'Sign-up, email confirmation, JWT, roles and password reset',
    directory: 'user-crud-authentification',
  },
];

const PLACEHOLDER = '{{projectName}}';

const usage = `Create an Express 5 and MongoDB REST API.

Usage:
  npx create-express-node-starter [directory] [options]

Options:
  -t, --template <name>  basic, product or auth
  -y, --yes              Use the defaults for everything not given
      --no-install       Skip npm install
      --no-git           Skip git init
  -h, --help             Show this help
  -v, --version          Show the version

Templates:
${TEMPLATES.map((t) => `  ${t.id.padEnd(9)}${t.name}: ${t.description}`).join('\n')}

Example:
  npx create-express-node-starter my-api --template auth`;

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
const bold = (text) => styleText('bold', text);
const dim = (text) => styleText('dim', text);
const cyan = (text) => styleText('cyan', text);
const green = (text) => styleText('green', text);

/**
 * Find a template by id (basic, product, auth), number (1-3) or directory name.
 * @param {string} value
 */
function findTemplate(value) {
  const key = String(value).trim().toLowerCase();
  const template =
    TEMPLATES.find((t) => t.id === key || t.directory === key) ||
    TEMPLATES[Number(key) - 1];
  if (!template) {
    throw new Error(
      `Unknown template "${value}". Choose one of: ${TEMPLATES.map((t) => t.id).join(', ')}`,
    );
  }
  return template;
}

/**
 * The npm package name for a directory: lowercase letters, digits, - and _.
 * It also names the MongoDB database, so dots and spaces are not allowed.
 * @param {string} directory
 */
function toPackageName(directory) {
  const name = path
    .basename(path.resolve(directory))
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .slice(0, 60);
  if (!name) {
    throw new Error(`Can't make a project name from "${directory}"`);
  }
  return name;
}

/**
 * Write the project name into every text file that holds the placeholder.
 * @param {string} directory
 * @param {string} name
 */
function replacePlaceholder(directory, name) {
  for (const entry of fs.readdirSync(directory, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!entry.isFile()) continue;
    const file = path.join(entry.parentPath, entry.name);
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes(PLACEHOLDER)) {
      fs.writeFileSync(file, text.replaceAll(PLACEHOLDER, name));
    }
  }
}

/**
 * Run a command in the project. On Windows, npm is a .cmd script that needs a
 * shell; the arguments are fixed strings, never user input.
 * @returns {boolean} Whether the command succeeded
 */
function run(command, args, cwd, { quiet = false } = {}) {
  const options = { cwd, stdio: quiet ? 'ignore' : 'inherit' };
  // Node.js deprecates passing arguments alongside shell: true, so give the
  // shell one command line instead.
  const result =
    process.platform === 'win32'
      ? spawnSync([command, ...args].join(' '), { ...options, shell: true })
      : spawnSync(command, args, options);
  return result.status === 0;
}

const isInsideGitRepo = (directory) =>
  spawnSync('git', ['rev-parse', '--is-inside-work-tree'], {
    cwd: directory,
    stdio: 'ignore',
  }).status === 0;

/* -------------------------------------------------------------------------- */
/*                               Create Project                               */
/* -------------------------------------------------------------------------- */

/**
 * Create a project from a template.
 * @param {object} options
 * @param {string} options.directory - Where to create it
 * @param {string} options.template - Template id, number or directory
 * @param {boolean} [options.install] - Run npm install
 * @param {boolean} [options.git] - Run git init
 * @returns {{ target: string, name: string, template: object, installed: boolean, git: boolean }}
 */
function createProject({ directory, template, install = true, git = true }) {
  const chosen = findTemplate(template);
  const target = path.resolve(directory);
  const name = toPackageName(directory);

  if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
    throw new Error(
      `${directory} is not empty. Choose a new directory or empty this one.`,
    );
  }

  fs.cpSync(path.join(__dirname, 'project-files', chosen.directory), target, {
    recursive: true,
  });
  // npm leaves .gitignore out of published packages, so it ships as gitignore.
  fs.renameSync(
    path.join(target, 'gitignore'),
    path.join(target, '.gitignore'),
  );
  replacePlaceholder(target, name);

  // A ready-to-run .env, with a random secret for signing tokens.
  const secret = crypto.randomBytes(48).toString('hex');
  const env = fs
    .readFileSync(path.join(target, '.env.example'), 'utf8')
    .replace(/^SECRET=$/m, `SECRET=${secret}`);
  fs.writeFileSync(path.join(target, '.env'), env);

  // git init first, so Husky can install its hooks during npm install.
  const initGit =
    git &&
    !isInsideGitRepo(path.dirname(target)) &&
    run('git', ['init', '--quiet'], target, { quiet: true });

  const installed = install && run('npm', ['install'], target);

  return { target, name, template: chosen, installed, git: initGit };
}

/* -------------------------------------------------------------------------- */
/*                                    Main                                    */
/* -------------------------------------------------------------------------- */
async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    allowNegative: true,
    options: {
      template: { type: 'string', short: 't' },
      yes: { type: 'boolean', short: 'y' },
      install: { type: 'boolean', default: true },
      git: { type: 'boolean', default: true },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
  });
  if (values.help) return console.log(usage);
  if (values.version) return console.log(version);

  console.log(`\n${bold('create-express-node-starter')} ${dim(`v${version}`)}`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  // Read answers line by line, so piped input (scripts, CI) works like typing.
  const lines = rl[Symbol.asyncIterator]();
  const ask = async (question) => {
    process.stdout.write(question);
    const { value = '', done } = await lines.next();
    if (done) process.stdout.write('\n');
    return value.trim();
  };

  let directory = positionals[0];
  let template = values.template;
  try {
    if (!directory) {
      directory = values.yes
        ? 'my-express-api'
        : (await ask(`Project directory ${dim('(my-express-api)')}: `)) ||
          'my-express-api';
    }
    if (!template) {
      if (values.yes) {
        template = 'basic';
      } else {
        const list = TEMPLATES.map(
          (t, i) => `  ${i + 1}) ${bold(t.name)}\n     ${dim(t.description)}`,
        ).join('\n');
        template =
          (await ask(`\nChoose a template:\n${list}\n${dim('(1)')} > `)) || '1';
      }
    }
  } finally {
    rl.close();
  }

  // Validate before copying anything.
  findTemplate(template);
  toPackageName(directory);

  console.log(`\nCreating ${cyan(directory)}…`);
  const result = createProject({
    directory,
    template,
    install: values.install,
    git: values.git,
  });

  const cd = path.relative(process.cwd(), result.target) || '.';
  const steps = [
    cd !== '.' && `cd ${cd}`,
    !result.installed && 'npm install',
    'npm run dev',
  ].filter(Boolean);

  console.log(`
${green('✔')} ${bold(result.template.name)} created in ${cyan(cd)}
${values.install && !result.installed ? `\n${styleText('yellow', '!')} npm install failed. Run it again in the project folder.\n` : ''}
${bold('Next steps')}
${steps.map((step) => `  ${cyan(step)}`).join('\n')}

  Make sure MongoDB is running, or set ${bold('DEV_DATABASE')} in .env.
  API docs:  ${cyan('http://localhost:5000/api-docs/')}
  Generate:  ${cyan('npm run crud:operation -- generate <name>')}
  Tests:     ${cyan('npm test')} ${dim('(in-memory MongoDB, nothing to set up)')}

Happy building!
`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`${styleText('red', '✖')} ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { TEMPLATES, createProject, findTemplate, toPackageName };
