import {
  companySummaryParamsSchema,
  REPORT_FORMATS,
  REPORT_IDS,
} from '@report-platform/shared';
import { CompanySummaryReport } from './company-summary.report';

describe('CompanySummaryReport', () => {
  it('declares stable metadata and delegates PDF rendering', async () => {
    const params = { from: '2026-04-01', to: '2026-04-13' };
    const rows = [{ companyName: 'North Logistics' }];
    const medicalChecksRepository = {
      getCompanySummary: vi.fn().mockResolvedValue(rows),
    };
    const pdfRenderer = {
      renderCompanySummary: vi.fn().mockResolvedValue({
        fileName: 'company-summary.pdf',
        contentType: 'application/pdf',
        buffer: Buffer.from('pdf'),
      }),
    };
    const report = new CompanySummaryReport(
      medicalChecksRepository as never,
      pdfRenderer as never,
    );

    expect(report.id).toBe(REPORT_IDS.companySummary);
    expect(report.format).toBe(REPORT_FORMATS.pdf);
    expect(report.paramsSchema).toBe(companySummaryParamsSchema);

    await report.generate(params);

    expect(medicalChecksRepository.getCompanySummary).toHaveBeenCalledWith(params);
    expect(pdfRenderer.renderCompanySummary).toHaveBeenCalledWith({
      rows,
      params,
    });
  });
});
