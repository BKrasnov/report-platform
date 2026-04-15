import type { ReportRun } from '../../domain/entities/report-run.entity';
import type { ReportRunViewModel } from '../view-models/report-run.view-model';

export function mapReportRunToViewModel(run: ReportRun): ReportRunViewModel {
  return {
    id: run.id,
    reportId: run.reportId,
    name: run.name,
    status: run.status,
    params: run.params,
    resultFileName: run.resultFileName,
    resultContentType: run.resultContentType,
    errorMessage: run.errorMessage,
    startedAt: run.startedAt?.toISOString() ?? null,
    finishedAt: run.finishedAt?.toISOString() ?? null,
    createdAt: run.createdAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
  };
}
