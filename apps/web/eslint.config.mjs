import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { fileURLToPath } from 'node:url';

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

const customRules = {
  'react-hooks/exhaustive-deps': 'warn',
  'max-len': ['error', { code: 160 }],
  semi: ['error', 'always'],
  quotes: [2, 'single', { avoidEscape: true }],
  'simple-import-sort/imports': [
    'warn',
    {
      groups: [
        ['^react', '^@?\\w'],
        ['^(app|pages|widgets|features|entities|shared)(/.*|$)'],
        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$', '^\\.\\.(?!/?$)', '^\\.\\./?$'],
        ['^'],
        ['^.+\\.?(types)$'],
        ['.module.scss', '.styled', '^.+\\.?(css)$'],
      ],
    },
  ],
  'prettier/prettier': ['warn'],
  '@typescript-eslint/naming-convention': [
    'warn',
    {
      selector: 'variable',
      types: ['boolean'],
      format: ['PascalCase'],
      prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
    },
  ],
  'react/no-unused-prop-types': ['warn'],
  'react/function-component-definition': [
    'warn',
    {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    },
  ],
  'import/no-default-export': 'error',
  'arrow-body-style': ['warn', 'as-needed'],
  'react/self-closing-comp': ['error', { component: true, html: true }],
  'react-hooks/set-state-in-effect': 'off',
  'react-hooks/static-components': 'off',
  'react-hooks/immutability': 'off',
  'react-hooks/refs': 'off',
  'react-hooks/error-boundaries': 'off',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/no-namespace': 'off',
};

const pagesOverride = {
  files: [
    'src/pages/**/*',
    './eslint.config.mjs',
    'vitest.config.ts',
    'vite.config.ts',
    'playwright.config.ts',
  ],
  rules: {
    'import/no-default-export': 'off',
    'react/function-component-definition': 'off',
  },
};

export default [
  {
    ignores: ['dist', 'node_modules', 'coverage', 'test-results'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir,
        ecmaFeatures: {
          jsx: true,
        },
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      '@typescript-eslint': tsEslintPlugin,
    },
    rules: customRules,
  },
  pagesOverride,
];
