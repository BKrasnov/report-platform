import { Injectable } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import type { ReportArtifact } from '../../domain/types/report-artifact';

export type StoredReportArtifact = {
  filePath: string;
  fileName: string;
  contentType: string;
};

@Injectable()
export class ReportArtifactStorageService {
  private readonly storageRoot: string;

  constructor() {
    this.storageRoot =
      process.env.REPORT_STORAGE_PATH ?? join(process.cwd(), 'storage', 'reports');
  }

  async save(
    reportId: string,
    runId: string,
    artifact: ReportArtifact,
  ): Promise<StoredReportArtifact> {
    const safeFileName = this.sanitizeFileName(artifact.fileName);
    const directory = join(this.storageRoot, reportId, runId);
    const filePath = join(directory, safeFileName);

    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(filePath, artifact.buffer, { flag: 'wx' });

    return {
      filePath,
      fileName: safeFileName,
      contentType: artifact.contentType,
    };
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }
}
