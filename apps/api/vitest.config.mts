import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@report-platform/shared': resolve(
        __dirname,
        '../../packages/shared/src/index.ts',
      ),
    },
  },
});
