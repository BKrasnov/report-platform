import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ReportArtifactStorageService } from './report-artifact-storage.service';

async function withStorageRoot(
  callback: (service: ReportArtifactStorageService, root: string) => Promise<void>,
): Promise<void> {
  const previousRoot = process.env.REPORT_STORAGE_PATH;
  const root = join(
    tmpdir(),
    `report-platform-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );

  process.env.REPORT_STORAGE_PATH = root;

  try {
    await callback(new ReportArtifactStorageService(), root);
  } finally {
    if (previousRoot === undefined) {
      delete process.env.REPORT_STORAGE_PATH;
    } else {
      process.env.REPORT_STORAGE_PATH = previousRoot;
    }

    await fs.rm(root, { recursive: true, force: true });
  }
}

describe('ReportArtifactStorageService', () => {
  it('stores artifacts under report id and run id', async () => {
    await withStorageRoot(async (service) => {
      const result = await service.save('driver-medical-checks', 'run-1', {
        fileName: 'checks.xlsx',
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from('content'),
      });

      expect(result.fileName).toBe('checks.xlsx');
      expect(result.filePath).toContain(join('driver-medical-checks', 'run-1'));
      await expect(fs.readFile(result.filePath, 'utf8')).resolves.toBe('content');
    });
  });

  it('sanitizes file names before saving', async () => {
    await withStorageRoot(async (service) => {
      const result = await service.save('company-summary', 'run-2', {
        fileName: '../summary report.pdf',
        contentType: 'application/pdf',
        buffer: Buffer.from('content'),
      });

      expect(result.fileName).toBe('.._summary_report.pdf');
      expect(result.filePath).toContain(join('company-summary', 'run-2'));
    });
  });
});
