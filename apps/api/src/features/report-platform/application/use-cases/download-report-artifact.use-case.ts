import { Injectable } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import { REPORT_RUN_STATUSES } from '@report-platform/shared';
import { AppError } from '../../../../common/exceptions/app-error';
import { ReportRunsRepository } from '../../infrastructure/repositories/report-runs.repository';

export type DownloadReportArtifactResult = {
  filePath: string;
  fileName: string;
  contentType: string;
};

@Injectable()
export class DownloadReportArtifactUseCase {
  constructor(private readonly reportRunsRepository: ReportRunsRepository) {}

  async execute(runId: string): Promise<DownloadReportArtifactResult> {
    const run = await this.reportRunsRepository.findById(runId);

    if (!run) {
      throw new AppError('REPORT_RUN_NOT_FOUND', 'Report run not found', 404, {
        runId,
      });
    }

    if (
      run.status !== REPORT_RUN_STATUSES.succeeded ||
      !run.resultFilePath ||
      !run.resultFileName ||
      !run.resultContentType
    ) {
      throw new AppError(
        'REPORT_RUN_NOT_READY',
        'Report artifact is not ready',
        409,
        { runId },
      );
    }

    try {
      await fs.access(run.resultFilePath);
    } catch {
      throw new AppError(
        'REPORT_ARTIFACT_MISSING',
        'Report artifact is missing',
        500,
        { runId },
      );
    }

    return {
      filePath: run.resultFilePath,
      fileName: run.resultFileName,
      contentType: run.resultContentType,
    };
  }
}
