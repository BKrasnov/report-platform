import { Injectable } from '@nestjs/common';
import {
  companySummaryParamsSchema,
  REPORT_FORMATS,
  REPORT_IDS,
  type CompanySummaryParams,
} from '@report-platform/shared';
import type { ReportArtifact } from '../../../domain/types/report-artifact';
import type { ReportDefinition } from '../../../domain/types/report-definition';
import { PdfRendererService } from '../../renderers/pdf-renderer.service';
import { MedicalChecksRepository } from '../../repositories/medical-checks.repository';
import { mapCompanySummaryRows } from './company-summary.mapper';

@Injectable()
export class CompanySummaryReport implements ReportDefinition<CompanySummaryParams> {
  readonly id = REPORT_IDS.companySummary;
  readonly title = 'Company Summary';
  readonly description = 'Aggregated medical check metrics by company';
  readonly format = REPORT_FORMATS.pdf;
  readonly paramsSchema = companySummaryParamsSchema;

  constructor(
    private readonly medicalChecksRepository: MedicalChecksRepository,
    private readonly pdfRenderer: PdfRendererService,
  ) {}

  async generate(params: CompanySummaryParams): Promise<ReportArtifact> {
    const rows = await this.medicalChecksRepository.getCompanySummary(params);

    return this.pdfRenderer.renderCompanySummary({
      rows: mapCompanySummaryRows(rows),
      params,
    });
  }
}
