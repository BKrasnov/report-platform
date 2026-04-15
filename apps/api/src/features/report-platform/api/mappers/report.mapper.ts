import type { ReportViewModel } from '../view-models/report.view-model';
import type { ReportDefinition } from '../../domain/types/report-definition';

export function mapReportToViewModel(report: ReportDefinition): ReportViewModel {
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    format: report.format,
  };
}
