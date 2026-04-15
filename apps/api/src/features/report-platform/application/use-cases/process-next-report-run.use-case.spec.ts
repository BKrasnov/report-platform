import { REPORT_IDS, REPORT_RUN_STATUSES } from '@report-platform/shared';
import type { ReportArtifact } from '../../domain/types/report-artifact';
import type { ReportRun } from '../../domain/entities/report-run.entity';
import {
  getRandomProcessingDelayMs,
  ProcessNextReportRunUseCase,
} from './process-next-report-run.use-case';

describe('ProcessNextReportRunUseCase', () => {
  it('waits before running report generation', async () => {
    const run = {
      id: 'run-delay',
      reportId: REPORT_IDS.driverMedicalChecks,
      status: REPORT_RUN_STATUSES.running,
    } satisfies Partial<ReportRun>;
    const artifact: ReportArtifact = {
      fileName: 'checks.xlsx',
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('xlsx'),
    };
    const queue = {
      claimNextQueued: vi.fn().mockResolvedValue(run),
    };
    const runner = {
      run: vi.fn().mockResolvedValue(artifact),
    };
    const storage = {
      save: vi.fn().mockResolvedValue({
        filePath: 'storage/reports/driver-medical-checks/run-delay/checks.xlsx',
        fileName: 'checks.xlsx',
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    };
    const reportRunsRepository = {
      markSucceeded: vi.fn().mockResolvedValue({
        ...run,
        status: REPORT_RUN_STATUSES.succeeded,
      }),
      markFailed: vi.fn(),
    };
    const getDelayMs = vi.fn().mockReturnValue(12_000);
    const sleep = vi.fn().mockResolvedValue(undefined);

    const useCase = new ProcessNextReportRunUseCase(
      queue as never,
      runner as never,
      storage as never,
      reportRunsRepository as never,
      { getDelayMs, sleep },
    );

    await useCase.execute();

    expect(getDelayMs).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(12_000);
    expect(runner.run).toHaveBeenCalledWith(run);
  });

  it('returns delay in 10-60 seconds range', () => {
    expect(getRandomProcessingDelayMs(() => 0)).toBe(10_000);
    expect(getRandomProcessingDelayMs(() => 1)).toBe(60_000);
  });

  it('claims the next run, generates an artifact, stores it, and marks it succeeded', async () => {
    const run = {
      id: 'run-1',
      reportId: REPORT_IDS.driverMedicalChecks,
      status: REPORT_RUN_STATUSES.running,
    } satisfies Partial<ReportRun>;
    const artifact: ReportArtifact = {
      fileName: 'checks.xlsx',
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('xlsx'),
    };
    const storedArtifact = {
      filePath: 'storage/reports/driver-medical-checks/run-1/checks.xlsx',
      fileName: 'checks.xlsx',
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    const queue = {
      claimNextQueued: vi.fn().mockResolvedValue(run),
    };
    const runner = {
      run: vi.fn().mockResolvedValue(artifact),
    };
    const storage = {
      save: vi.fn().mockResolvedValue(storedArtifact),
    };
    const reportRunsRepository = {
      markSucceeded: vi.fn().mockResolvedValue({
        ...run,
        status: REPORT_RUN_STATUSES.succeeded,
      }),
      markFailed: vi.fn(),
    };
    const sleep = vi.fn().mockResolvedValue(undefined);
    const useCase = new ProcessNextReportRunUseCase(
      queue as never,
      runner as never,
      storage as never,
      reportRunsRepository as never,
      { getDelayMs: () => 0, sleep },
    );

    await useCase.execute();

    expect(queue.claimNextQueued).toHaveBeenCalled();
    expect(runner.run).toHaveBeenCalledWith(run);
    expect(storage.save).toHaveBeenCalledWith(run.reportId, run.id, artifact);
    expect(reportRunsRepository.markSucceeded).toHaveBeenCalledWith(
      run,
      storedArtifact,
    );
    expect(reportRunsRepository.markFailed).not.toHaveBeenCalled();
  });

  it('marks the run failed when generation throws', async () => {
    const run = {
      id: 'run-2',
      reportId: REPORT_IDS.companySummary,
      status: REPORT_RUN_STATUSES.running,
    } satisfies Partial<ReportRun>;
    const queue = {
      claimNextQueued: vi.fn().mockResolvedValue(run),
    };
    const runner = {
      run: vi.fn().mockRejectedValue(new Error('Renderer failed')),
    };
    const storage = {
      save: vi.fn(),
    };
    const reportRunsRepository = {
      markSucceeded: vi.fn(),
      markFailed: vi.fn().mockResolvedValue({
        ...run,
        status: REPORT_RUN_STATUSES.failed,
        errorMessage: 'Renderer failed',
      }),
    };
    const sleep = vi.fn().mockResolvedValue(undefined);
    const useCase = new ProcessNextReportRunUseCase(
      queue as never,
      runner as never,
      storage as never,
      reportRunsRepository as never,
      { getDelayMs: () => 0, sleep },
    );

    await useCase.execute();

    expect(reportRunsRepository.markFailed).toHaveBeenCalledWith(
      run,
      'Renderer failed',
    );
    expect(storage.save).not.toHaveBeenCalled();
    expect(reportRunsRepository.markSucceeded).not.toHaveBeenCalled();
  });
});
