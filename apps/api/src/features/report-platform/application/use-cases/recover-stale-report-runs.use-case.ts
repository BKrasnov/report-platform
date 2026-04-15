import { Injectable } from '@nestjs/common';
import { ReportRunsRepository } from '../../infrastructure/repositories/report-runs.repository';

const DEFAULT_RUN_TIMEOUT_MS = 15 * 60 * 1000;

@Injectable()
export class RecoverStaleReportRunsUseCase {
  constructor(private readonly reportRunsRepository: ReportRunsRepository) {}

  execute(now: Date = new Date(), timeoutMs?: number): Promise<number> {
    const resolvedTimeoutMs = this.resolveTimeoutMs(timeoutMs);
    const staleBefore = new Date(now.getTime() - resolvedTimeoutMs);
    const errorMessage = `Report run timed out after ${Math.floor(resolvedTimeoutMs / 1000)}s`;

    return this.reportRunsRepository.markStaleRunningAsFailed(
      staleBefore,
      errorMessage,
    );
  }

  private resolveTimeoutMs(timeoutMs: number | undefined): number {
    const rawTimeout =
      timeoutMs === undefined
        ? Number(process.env.WORKER_RUN_TIMEOUT_MS ?? DEFAULT_RUN_TIMEOUT_MS)
        : timeoutMs;

    if (typeof rawTimeout !== 'number' || !Number.isFinite(rawTimeout) || rawTimeout <= 0) {
      return DEFAULT_RUN_TIMEOUT_MS;
    }

    return Math.floor(rawTimeout);
  }
}
