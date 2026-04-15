import { Injectable } from '@nestjs/common';
import { AppError } from '../../../../common/exceptions/app-error';
import type { ReportRun } from '../../domain/entities/report-run.entity';
import { ReportRunsRepository } from '../../infrastructure/repositories/report-runs.repository';

@Injectable()
export class GetReportRunUseCase {
  constructor(private readonly reportRunsRepository: ReportRunsRepository) {}

  async execute(runId: string): Promise<ReportRun> {
    const run = await this.reportRunsRepository.findById(runId);

    if (!run) {
      throw new AppError('REPORT_RUN_NOT_FOUND', 'Report run not found', 404, {
        runId,
      });
    }

    return run;
  }
}
