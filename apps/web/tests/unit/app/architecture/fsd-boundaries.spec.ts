import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const FSD_IMPORT_RULES = [
  {
    layer: 'features',
    forbiddenImportRegex: /@\/pages\//,
    message: 'features must not import pages',
  },
  {
    layer: 'widgets',
    forbiddenImportRegex: /@\/pages\//,
    message: 'widgets must not import pages',
  },
];
const SOURCE_FILE_REGEX = /\.(ts|tsx)$/;

function collectSourceFiles(directoryPath: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directoryPath)) {
    const fullPath = join(directoryPath, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (SOURCE_FILE_REGEX.test(entry)) {
      files.push(fullPath);
    }
  }

  return files;
}

function findForbiddenImports(filePath: string, forbiddenImportRegex: RegExp): string[] {
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  const violations: string[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    if (!forbiddenImportRegex.test(line)) {
      continue;
    }

    violations.push(`${relative(SOURCE_ROOT, filePath)}:${lineIndex + 1}: ${line.trim()}`);
  }

  return violations;
}

function hasWidgetSegmentsRecursive(path: string): boolean {
  const hasUi = existsSync(join(path, 'ui'));
  const hasModel = existsSync(join(path, 'model'));
  if (hasUi && hasModel) {
    return true;
  }

  const nestedDirectories = readdirSync(path).filter((entryName) =>
    statSync(join(path, entryName)).isDirectory()
  );
  if (nestedDirectories.length === 0) {
    return false;
  }

  return nestedDirectories.every((entryName) => hasWidgetSegmentsRecursive(join(path, entryName)));
}

describe('FSD boundaries', () => {
  for (const rule of FSD_IMPORT_RULES) {
    it(rule.message, () => {
      const layerPath = join(SOURCE_ROOT, rule.layer);
      const layerFiles = collectSourceFiles(layerPath);
      const violations = layerFiles.flatMap((filePath) =>
        findForbiddenImports(filePath, rule.forbiddenImportRegex)
      );

      expect(
        violations,
        violations.length === 0
          ? undefined
          : `Forbidden imports in ${rule.layer}:\n${violations.join('\n')}`
      ).toEqual([]);
    });
  }

  it('widgets must have ui and model segments', () => {
    const widgetsRoot = join(SOURCE_ROOT, 'widgets');
    const widgetDirectories = readdirSync(widgetsRoot).filter((entryName) =>
      statSync(join(widgetsRoot, entryName)).isDirectory()
    );

    const missingSegments: string[] = [];

    for (const widgetDirectory of widgetDirectories) {
      const widgetPath = join(widgetsRoot, widgetDirectory);
      if (!hasWidgetSegmentsRecursive(widgetPath)) {
        missingSegments.push(`${relative(SOURCE_ROOT, widgetPath)} (missing ui/model structure)`);
      }
    }

    expect(
      missingSegments,
      missingSegments.length === 0
        ? undefined
        : `Widgets without required segments:\n${missingSegments.join('\n')}`
    ).toEqual([]);
  });
});
