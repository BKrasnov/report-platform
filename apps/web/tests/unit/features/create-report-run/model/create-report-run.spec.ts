import { REPORT_IDS } from '@report-platform/shared';
import { describe, expect, it } from 'vitest';

import { HttpError } from '@/shared/api/http-error';
import { createReportRunModel } from '@/widgets/report/create';

describe('create-report-run feature', () => {
  it('builds payload and omits empty company id', () => {
    const payload = createReportRunModel.utils.buildCreateRunPayload({
      reportId: REPORT_IDS.driverMedicalChecks,
      name: 'April run',
      from: '2026-01-01',
      to: '2026-01-31',
      companyId: '   ',
    });

    expect(payload.name).toBe('April run');
    expect(payload.params).toEqual({
      from: '2026-01-01',
      to: '2026-01-31',
    });
  });

  it('returns validation error for invalid form input', () => {
    const validationMessage = createReportRunModel.utils.validateCreateRunForm(
      {
        reportId: REPORT_IDS.driverMedicalChecks,
        name: '',
        from: '2026-99-99',
        to: '2026-01-31',
        companyId: 'invalid',
      },
      []
    );

    expect(validationMessage).toBeTruthy();
  });

  it('returns null for valid dates and known company id', () => {
    const validationMessage = createReportRunModel.utils.validateCreateRunForm(
      {
        reportId: REPORT_IDS.driverMedicalChecks,
        name: 'April run',
        from: '2026-01-01',
        to: '2026-01-31',
        companyId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      },
      [{ id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'Company' }]
    );

    expect(validationMessage).toBeNull();
  });

  it('maps structured backend validation details to a specific message', () => {
    const message = createReportRunModel.utils.getCreateRunErrorMessage(
      new HttpError(400, {
        error: {
          code: 'REPORT_PARAMS_INVALID',
          details: [
            {
              path: ['from'],
              message: 'Invalid date',
            },
          ],
        },
      })
    );

    expect(message).not.toBe(createReportRunModel.constants.CREATE_RUN_DEFAULT_ERROR_MESSAGE);
  });

  it('falls back to default message for unknown errors', () => {
    const message = createReportRunModel.utils.getCreateRunErrorMessage(new Error('boom'));

    expect(message).toBe(createReportRunModel.constants.CREATE_RUN_DEFAULT_ERROR_MESSAGE);
  });

  it('returns validation error when name is empty', () => {
    const validationMessage = createReportRunModel.utils.validateCreateRunForm(
      {
        reportId: REPORT_IDS.driverMedicalChecks,
        name: '   ',
        from: '2026-01-01',
        to: '2026-01-31',
        companyId: '',
      },
      [],
    );

    expect(validationMessage).toBeTruthy();
  });
});
