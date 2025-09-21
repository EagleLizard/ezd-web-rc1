
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import reactEslint from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  pluginJs.configs.recommended,
  tsEslint.configs.recommended,
  reactEslint.configs.flat.recommended,
  /* see: https://stackoverflow.com/a/77679839/4677252 */
  reactEslint.configs.flat['jsx-runtime'],
  {
    ignores: [ 'dist' ],
  },
  {
    files: [
      '**/*.{js,jsx}',
      '**/*.{ts,tsx}',
    ],
    languageOptions: {
      /*
        Following eslint-plugin-react README,
          see: https://github.com/jsx-eslint/eslint-plugin-react/blob/dd2e9681bca4c20fa184c5bbaca3090ec51d8d7a/README.md#plugin
      _*/
      parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        // ...globals.node
      }
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
      'react': reactEslint,
    },
    rules: {
      indent: [
        'error',
        2,
        {
          'MemberExpression': 1,
          'SwitchCase': 1
        },
      ],
      semi: 'error',
      eqeqeq: [ 'error', 'always' ],
      quotes: [ 'error', 'single' ],
      // 'no-octal': [ 'off' ],
      'no-multiple-empty-lines': [ 'error', { 'max': 1, 'maxBOF': 1 }],
      'no-unused-vars': [ 'warn' ],
      '@stylistic/array-bracket-spacing': [ 'error', 'always', { 'objectsInArrays': false, 'arraysInArrays': false }],
      '@stylistic/eol-last': [ 'error', 'always' ],
      /* TS */
      'prefer-const': [ 'off' ],
      // 'no-unused-vars': [ 'off' ],
      '@typescript-eslint/no-unused-vars': [ 'warn' ],
    },
  }
];

// export default tsEslint.config(config);
export default defineConfig(config);
