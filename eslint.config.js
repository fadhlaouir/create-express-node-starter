const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // Each template is linted with its own config when its tests run.
  { ignores: ['node_modules/', 'coverage/', 'lib/project-files/'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: { sourceType: 'module' },
  },
];
