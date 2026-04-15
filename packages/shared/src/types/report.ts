import type { ReportFormat } from '../constants/report-formats';
import type { ReportId } from '../constants/report-ids';

export type ReportView = {
  id: ReportId;
  title: string;
  description: string;
  format: ReportFormat;
};
