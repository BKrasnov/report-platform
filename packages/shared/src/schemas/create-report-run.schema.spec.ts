import { REPORT_IDS } from '../constants/report-ids';
import { createReportRunSchema } from './create-report-run.schema';

describe('createReportRunSchema', () => {
  it('accepts valid request with name', () => {
    const input = {
      reportId: REPORT_IDS.driverMedicalChecks,
      name: 'Drivers medical checks for April',
      params: { from: '2026-04-01', to: '2026-04-30' },
    };

    expect(createReportRunSchema.parse(input)).toEqual(input);
  });

  it('rejects empty or whitespace-only names', () => {
    expect(() =>
      createReportRunSchema.parse({
        reportId: REPORT_IDS.driverMedicalChecks,
        name: '   ',
        params: {},
      }),
    ).toThrow();
  });

  it('rejects names longer than 120 chars', () => {
    expect(() =>
      createReportRunSchema.parse({
        reportId: REPORT_IDS.driverMedicalChecks,
        name: 'a'.repeat(121),
        params: {},
      }),
    ).toThrow();
  });

  it('trims name before returning parsed payload', () => {
    expect(
      createReportRunSchema.parse({
        reportId: REPORT_IDS.driverMedicalChecks,
        name: '  Monthly run  ',
        params: {},
      }),
    ).toMatchObject({ name: 'Monthly run' });
  });

  it('requires name', () => {
    expect(() =>
      createReportRunSchema.parse({
        reportId: REPORT_IDS.driverMedicalChecks,
        params: {},
      }),
    ).toThrow();
  });
});
