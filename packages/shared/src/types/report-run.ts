import type { ReportId } from '../constants/report-ids';
import type { ReportRunStatus } from '../constants/report-run-statuses';

export type ReportRunView = {
  id: string;
  reportId: ReportId;
  name: string | null;
  status: ReportRunStatus;
  params: Record<string, unknown>;
  resultFileName: string | null;
  resultContentType: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
