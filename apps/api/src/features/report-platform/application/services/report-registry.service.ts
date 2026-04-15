import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../../common/exceptions/app-error';
import type { ReportDefinition } from '../../domain/types/report-definition';

export const REPORT_DEFINITIONS = Symbol('REPORT_DEFINITIONS');

@Injectable()
export class ReportRegistryService {
  private readonly reportsById: Map<string, ReportDefinition>;

  constructor(
    @Inject(REPORT_DEFINITIONS)
    reportDefinitions: ReportDefinition[],
  ) {
    this.reportsById = new Map(
      reportDefinitions.map((report) => [report.id, report]),
    );
  }

  list(): ReportDefinition[] {
    return [...this.reportsById.values()];
  }

  getById(reportId: string): ReportDefinition {
    const report = this.reportsById.get(reportId);

    if (!report) {
      throw new AppError('REPORT_NOT_FOUND', 'Report not found', 404, {
        reportId,
      });
    }

    return report;
  }
}
