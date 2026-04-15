import { REPORT_FORMATS, REPORT_IDS } from '@report-platform/shared';
import { z } from 'zod';
import { AppError } from '../../../../common/exceptions/app-error';
import type { ReportDefinition } from '../../domain/types/report-definition';
import { ReportRegistryService } from './report-registry.service';

const report: ReportDefinition<Record<string, never>> = {
  id: REPORT_IDS.driverMedicalChecks,
  title: 'Driver Medical Checks',
  description: 'Medical checks export',
  format: REPORT_FORMATS.xlsx,
  paramsSchema: z.object({}),
  async generate() {
    return {
      fileName: 'driver-medical-checks.xlsx',
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('xlsx'),
    };
  },
};

describe('ReportRegistryService', () => {
  it('lists registered reports', () => {
    const registry = new ReportRegistryService([report]);

    expect(registry.list()).toEqual([report]);
  });

  it('returns report by id', () => {
    const registry = new ReportRegistryService([report]);

    expect(registry.getById(REPORT_IDS.driverMedicalChecks)).toBe(report);
  });

  it('throws report not found for unknown report id', () => {
    const registry = new ReportRegistryService([report]);

    expect(() => registry.getById('unknown')).toThrow(AppError);
    expect(() => registry.getById('unknown')).toThrow('Report not found');
  });
});
