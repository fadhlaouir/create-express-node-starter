#!/usr/bin/env node
// Rebuilds the templates in lib/project-files from express-node-starter, so the
// generated projects get the same code, fixes and tests as the starter:
//
//   node scripts/sync-templates.mjs ../express-node-starter
//
// Files in scripts/overlays/<template> (and _no-auth for templates without users)
// are copied on top. Every text replacement checks its anchor, so a change in
// the starter that breaks one stops the sync instead of producing a bad template.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const overlays = path.join(root, 'scripts', 'overlays');
const output = path.join(root, 'lib', 'project-files');

const source = process.argv[2] && path.resolve(process.argv[2]);
if (!source || !fs.existsSync(path.join(source, 'package.json'))) {
  console.error(
    'Usage: node scripts/sync-templates.mjs <path-to-express-node-starter>',
  );
  process.exit(1);
}
const sourcePackage = readJson(path.join(source, 'package.json'));
if (sourcePackage.name !== 'express-node-starter') {
  console.error(`${source} is not express-node-starter.`);
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/*                                  Templates                                 */
/* -------------------------------------------------------------------------- */

// Repository files that don't belong in a generated project.
const REPO_ONLY = [
  /^\.github\/(?!workflows\/ci\.yml$)/,
  /^(CHANGELOG|CODE_OF_CONDUCT|SECURITY|README)\.md$/,
  /^LICENSE$/,
  /^package-lock\.json$/,
];

// Everything that exists only for user accounts.
const AUTH_FILES = [
  'src/controllers/auth.controller.js',
  'src/controllers/user.controller.js',
  'src/models/user.model.js',
  'src/routes/auth.route.js',
  'src/routes/user.route.js',
  'src/middlewares/verify-token.js',
  'src/middlewares/authorize.js',
  'src/template/userAccountEmailTemplates.js',
  'src/utils/helpers.js',
  'src/utils/token.js',
  'test/auth.test.js',
  'test/users.test.js',
];
const AUTH_DEPENDENCIES = ['bcryptjs', 'jsonwebtoken', 'nodemailer'];

const TEMPLATES = [
  {
    directory: 'basic-project',
    description: 'REST API with Express 5 and MongoDB',
    auth: false,
    uploads: false,
  },
  {
    directory: 'product-crud',
    description: 'Product API with Express 5 and MongoDB',
    auth: false,
    uploads: true,
  },
  {
    directory: 'user-crud-authentification',
    description: 'REST API with Express 5, MongoDB and JWT authentication',
    auth: true,
    uploads: true,
  },
];

/* -------------------------------------------------------------------------- */
/*                                    Build                                   */
/* -------------------------------------------------------------------------- */

const tracked = execFileSync('git', ['ls-files'], {
  cwd: source,
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean)
  .filter((file) => !REPO_ONLY.some((pattern) => pattern.test(file)));

for (const template of TEMPLATES) {
  const target = path.join(output, template.directory);
  fs.rmSync(target, { recursive: true, force: true });

  const dropped = new Set(template.auth ? [] : AUTH_FILES);
  if (!template.uploads) dropped.add('src/middlewares/multer.js');

  for (const file of tracked) {
    if (dropped.has(file)) continue;
    copy(path.join(source, file), path.join(target, file));
  }
  if (!template.auth) copyTree(path.join(overlays, '_no-auth'), target);
  copyTree(path.join(overlays, template.directory), target);

  patchPackage(target, template);
  patchApp(target, template);
  patchSwagger(target, template);
  for (const file of [
    '.env.example',
    'docker-compose.yml',
    '.github/workflows/ci.yml',
  ]) {
    replaceAll(target, file, 'express-node-starter', '{{projectName}}');
  }

  // npm drops .gitignore from published packages; the CLI renames it back.
  fs.renameSync(
    path.join(target, '.gitignore'),
    path.join(target, 'gitignore'),
  );

  console.log(`✔ ${template.directory}`);
}

// Format with each template's own Prettier config, so projects start clean.
execFileSync(
  process.execPath,
  [
    path.join(root, 'node_modules', 'prettier', 'bin', 'prettier.cjs'),
    '--write',
    '--log-level=warn',
    output,
  ],
  { stdio: 'inherit' },
);

/* -------------------------------------------------------------------------- */
/*                                   Patches                                  */
/* -------------------------------------------------------------------------- */

function patchPackage(target, template) {
  const file = path.join(target, 'package.json');
  const pkg = readJson(file);
  for (const key of [
    'author',
    'homepage',
    'bugs',
    'repository',
    'funding',
    'keywords',
    'files',
  ]) {
    delete pkg[key];
  }
  for (const script of Object.keys(pkg.scripts)) {
    if (script.startsWith('release')) delete pkg.scripts[script];
  }
  delete pkg.devDependencies['commit-and-tag-version'];
  if (!template.auth) {
    for (const name of AUTH_DEPENDENCIES) delete pkg.dependencies[name];
  }
  if (!template.uploads) delete pkg.dependencies.multer;

  // eslint-disable-next-line no-unused-vars
  const { name, version, description, license, ...rest } = pkg;
  const result = {
    name: '{{projectName}}',
    version: '1.0.0',
    private: true,
    description: template.description,
    ...rest,
  };
  fs.writeFileSync(file, `${JSON.stringify(result, null, 2)}\n`);
}

function patchApp(target, template) {
  replace(
    target,
    'src/app.js',
    "name: 'Express Node Starter API'",
    "name: '{{projectName}}'",
  );
  if (template.uploads) return;
  replace(
    target,
    'src/app.js',
    "const { UPLOAD_DIR } = require('./middlewares/multer');\n",
    '',
  );
  replace(
    target,
    'src/app.js',
    `// Uploaded files. express.static refuses paths outside the folder.
app.use(
  '/uploads',
  helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }),
  express.static(UPLOAD_DIR, { dotfiles: 'deny', index: false }),
);

`,
    '',
  );
}

function patchSwagger(target, template) {
  const file = path.join(target, 'src', 'swagger.json');
  const spec = readJson(file);
  spec.info = {
    title: '{{projectName}}',
    version: '1.0.0',
    description: `${template.description}.`,
  };
  if (!template.auth) {
    spec.paths = {};
    spec.tags = [];
    delete spec.components.securitySchemes;
    spec.components.schemas = { Message: spec.components.schemas.Message };
  }
  if (template.directory === 'product-crud') addProductSpec(spec);
  fs.writeFileSync(file, `${JSON.stringify(spec, null, 2)}\n`);
}

function addProductSpec(spec) {
  const message = { $ref: '#/components/responses/Message' };
  const productResponse = (description) => ({
    description,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            product: { $ref: '#/components/schemas/Product' },
          },
        },
      },
    },
  });
  const productInput = (required) => ({
    ...(required && { required: true }),
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ProductInput' },
      },
      'multipart/form-data': {
        schema: {
          allOf: [
            { $ref: '#/components/schemas/ProductInput' },
            {
              type: 'object',
              properties: { photo: { type: 'string', format: 'binary' } },
            },
          ],
        },
      },
    },
  });
  const idParameter = {
    name: 'id',
    in: 'path',
    required: true,
    schema: { type: 'string' },
  };

  spec.tags = [{ name: 'Products', description: 'Product catalogue' }];
  spec.components.schemas.ProductInput = {
    type: 'object',
    required: ['name', 'price'],
    properties: {
      name: { type: 'string', example: 'Blue mug' },
      description: { type: 'string', example: 'Ceramic, 350 ml' },
      price: { type: 'number', minimum: 0, example: 12.5 },
      quantity: { type: 'integer', minimum: 0, example: 3 },
    },
  };
  spec.components.schemas.Product = {
    allOf: [
      { $ref: '#/components/schemas/ProductInput' },
      {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          photo: {
            type: 'string',
            example: 'uploads/3f2b8c1e-6a4d-4e2f-9b7a-1c5d8e0f2a4b.png',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    ],
  };
  spec.paths['/products'] = {
    post: {
      tags: ['Products'],
      summary: 'Create a product',
      description:
        'Send JSON, or multipart form data to attach a photo (JPEG, PNG, GIF or WebP, up to 5 MB).',
      requestBody: productInput(true),
      responses: { 201: productResponse('The new product'), 422: message },
    },
    get: {
      tags: ['Products'],
      summary: 'List products, newest first',
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        },
        {
          name: 'q',
          in: 'query',
          description: 'Search product names (case-insensitive)',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'A page of products',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  products: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Product' },
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                      total: { type: 'integer' },
                      pages: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  spec.paths['/products/{id}'] = {
    parameters: [idParameter],
    get: {
      tags: ['Products'],
      summary: 'Get a product',
      responses: { 200: productResponse('The product'), 404: message },
    },
    put: {
      tags: ['Products'],
      summary: 'Update a product',
      description:
        'Only the fields sent are changed. A new photo replaces the old one.',
      requestBody: productInput(false),
      responses: {
        200: productResponse('The updated product'),
        404: message,
        422: message,
      },
    },
    delete: {
      tags: ['Products'],
      summary: 'Delete a product and its photo',
      responses: { 200: message, 404: message },
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyTree(from, to) {
  if (fs.existsSync(from)) fs.cpSync(from, to, { recursive: true });
}

function replace(target, file, search, replacement) {
  const full = path.join(target, file);
  const text = fs.readFileSync(full, 'utf8').replaceAll('\r\n', '\n');
  if (!text.includes(search)) {
    throw new Error(`${file}: expected text not found:\n${search}`);
  }
  fs.writeFileSync(full, text.replace(search, replacement));
}

function replaceAll(target, file, search, replacement) {
  const full = path.join(target, file);
  let text;
  try {
    text = fs.readFileSync(full, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return; // not every template has every file
    throw error;
  }
  fs.writeFileSync(full, text.replaceAll(search, replacement));
}
