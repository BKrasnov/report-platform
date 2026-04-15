import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('README', () => {
  it('documents frontend dev command', () => {
    const readmePath = resolve(process.cwd(), '..', '..', 'README.md');
    const readme = readFileSync(readmePath, 'utf8');
    expect(readme).toContain('pnpm dev:web');
  });
});
