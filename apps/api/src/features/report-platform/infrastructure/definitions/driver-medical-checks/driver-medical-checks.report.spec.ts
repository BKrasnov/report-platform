import {
  driverMedicalChecksParamsSchema,
  REPORT_FORMATS,
  REPORT_IDS,
} from '@report-platform/shared';
import { DriverMedicalChecksReport } from './driver-medical-checks.report';

describe('DriverMedicalChecksReport', () => {
  it('declares stable metadata and delegates XLSX rendering', async () => {
    const params = { from: '2026-04-01', to: '2026-04-13' };
    const rows = [{ driverFullName: 'Ivan Petrov' }];
    const medicalChecksRepository = {
      findDriverChecks: vi.fn().mockResolvedValue(rows),
    };
    const xlsxRenderer = {
      renderDriverMedicalChecks: vi.fn().mockResolvedValue({
        fileName: 'driver-medical-checks.xlsx',
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from('xlsx'),
      }),
    };
    const report = new DriverMedicalChecksReport(
      medicalChecksRepository as never,
      xlsxRenderer as never,
    );

    expect(report.id).toBe(REPORT_IDS.driverMedicalChecks);
    expect(report.format).toBe(REPORT_FORMATS.xlsx);
    expect(report.paramsSchema).toBe(driverMedicalChecksParamsSchema);

    await report.generate(params);

    expect(medicalChecksRepository.findDriverChecks).toHaveBeenCalledWith(params);
    expect(xlsxRenderer.renderDriverMedicalChecks).toHaveBeenCalledWith({
      rows,
      params,
    });
  });
});
