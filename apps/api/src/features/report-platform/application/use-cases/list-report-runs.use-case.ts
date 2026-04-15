import { Injectable } from '@nestjs/common';
import type { ReportId, ReportRunStatus } from '@report-platform/shared';
import type { ReportRun } from '../../domain/entities/report-run.entity';
import { ReportRunsRepository } from '../../infrastructure/repositories/report-runs.repository';

export type ListReportRunsInput = {
  status?: ReportRunStatus;
  reportId?: ReportId;
  limit?: number;
  offset?: number;
};

@Injectable()
export class ListReportRunsUseCase {
  constructor(private readonly reportRunsRepository: ReportRunsRepository) {}

  execute(input: ListReportRunsInput = {}): Promise<ReportRun[]> {
    return this.reportRunsRepository.findMany({
      status: input.status,
      reportId: input.reportId,
      limit: input.limit ?? 20,
      offset: input.offset ?? 0,
    });
  }
}
