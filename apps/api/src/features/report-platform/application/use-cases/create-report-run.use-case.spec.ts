import { REPORT_IDS, REPORT_RUN_STATUSES } from '@report-platform/shared';
import { z } from 'zod';
import { AppError } from '../../../../common/exceptions/app-error';
import type { ReportRun } from '../../domain/entities/report-run.entity';
import { CreateReportRunUseCase } from './create-report-run.use-case';

describe('CreateReportRunUseCase', () => {
  it('validates request shape with shared schema before report lookup', async () => {
    const registry = {
      getById: vi.fn(),
    };
    const reportRunsRepository = {
      createQueued: vi.fn(),
    };
    const useCase = new CreateReportRunUseCase(
      registry as never,
      reportRunsRepository as never,
    );

    let thrownError: unknown = null;
    try {
      await useCase.execute({
        reportId: REPORT_IDS.driverMedicalChecks,
        name: '   ',
        params: {},
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toMatchObject({
      code: 'REPORT_PARAMS_INVALID',
      statusCode: 400,
    } satisfies Partial<AppError>);
    expect(registry.getById).not.toHaveBeenCalled();
    expect(reportRunsRepository.createQueued).not.toHaveBeenCalled();
  });

  it('creates a queued report run with parsed params and name', async () => {
    const registry = {
      getById: vi.fn().mockReturnValue({
        id: REPORT_IDS.driverMedicalChecks,
        paramsSchema: {
          parse: vi.fn().mockReturnValue({
            from: '2026-04-01',
            to: '2026-04-13',
          }),
        },
      }),
    };
    const reportRunsRepository = {
      createQueued: vi.fn().mockResolvedValue({
        id: 'run-1',
        reportId: REPORT_IDS.driverMedicalChecks,
        status: REPORT_RUN_STATUSES.queued,
      } satisfies Partial<ReportRun>),
    };
    const useCase = new CreateReportRunUseCase(
      registry as never,
      reportRunsRepository as never,
    );

    const result = await useCase.execute({
      reportId: REPORT_IDS.driverMedicalChecks,
      name: 'April run',
      params: {
        from: '2026-04-01',
        to: '2026-04-13',
      },
    });

    expect(registry.getById).toHaveBeenCalledWith(REPORT_IDS.driverMedicalChecks);
    expect(reportRunsRepository.createQueued).toHaveBeenCalledWith({
      reportId: REPORT_IDS.driverMedicalChecks,
      name: 'April run',
      params: {
        from: '2026-04-01',
        to: '2026-04-13',
      },
    });
    expect(result.status).toBe(REPORT_RUN_STATUSES.queued);
  });

  it('throws REPORT_PARAMS_INVALID when params do not match schema', async () => {
    const paramsSchema = z
      .object({
        from: z.string().date(),
        to: z.string().date(),
        companyId: z.string().uuid(),
      })
      .refine((value) => value.from <= value.to, {
        message: '`from` must be before or equal to `to`',
        path: ['from'],
      });
    const registry = {
      getById: vi.fn().mockReturnValue({
        id: REPORT_IDS.driverMedicalChecks,
        paramsSchema: {
          parse: vi.fn((value: unknown) => paramsSchema.parse(value)),
        },
      }),
    };
    const reportRunsRepository = {
      createQueued: vi.fn(),
    };
    const useCase = new CreateReportRunUseCase(
      registry as never,
      reportRunsRepository as never,
    );

    let thrownError: unknown = null;
    try {
      await useCase.execute({
        reportId: REPORT_IDS.driverMedicalChecks,
        name: 'April run',
        params: {
          from: '20000-01-12',
          to: '123213-03-12',
          companyId: '1',
        },
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toMatchObject({
      code: 'REPORT_PARAMS_INVALID',
      statusCode: 400,
    } satisfies Partial<AppError>);
    expect((thrownError as AppError).details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['from'] }),
        expect.objectContaining({ path: ['to'] }),
        expect.objectContaining({ path: ['companyId'] }),
      ]),
    );

    expect(reportRunsRepository.createQueued).not.toHaveBeenCalled();
  });
});
