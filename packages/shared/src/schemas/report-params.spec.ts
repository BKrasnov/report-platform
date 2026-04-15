import {
  companySummaryParamsSchema,
  driverMedicalChecksParamsSchema,
} from '..';

describe('report parameter schemas', () => {
  it('accepts valid date range params', () => {
    const params = {
      from: '2026-04-01',
      to: '2026-04-13',
    };

    expect(driverMedicalChecksParamsSchema.parse(params)).toEqual(params);
    expect(companySummaryParamsSchema.parse(params)).toEqual(params);
  });

  it('accepts optional company id', () => {
    const params = {
      from: '2026-04-01',
      to: '2026-04-13',
      companyId: '1f5a36d0-9a8f-4e72-94ef-b54f48a53ec9',
    };

    expect(driverMedicalChecksParamsSchema.parse(params)).toEqual(params);
    expect(companySummaryParamsSchema.parse(params)).toEqual(params);
  });

  it('rejects invalid date ranges', () => {
    const params = {
      from: '2026-04-13',
      to: '2026-04-01',
    };

    expect(() => driverMedicalChecksParamsSchema.parse(params)).toThrow();
    expect(() => companySummaryParamsSchema.parse(params)).toThrow();
  });
});
