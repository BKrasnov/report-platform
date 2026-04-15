import { Inject, Injectable, Optional } from '@nestjs/common';
import type { ReportRun } from '../../domain/entities/report-run.entity';
import { ReportRunsRepository } from '../../infrastructure/repositories/report-runs.repository';
import { ReportArtifactStorageService } from '../services/report-artifact-storage.service';
import { ReportRunQueueService } from '../services/report-run-queue.service';
import { ReportRunnerService } from '../services/report-runner.service';

const MIN_PROCESSING_DELAY_MS = 10_000;
const MAX_PROCESSING_DELAY_MS = 60_000;

type ProcessingDelayProvider = {
  getDelayMs: () => number;
  sleep: (ms: number) => Promise<void>;
};

export const PROCESSING_DELAY_PROVIDER = Symbol('PROCESSING_DELAY_PROVIDER');

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const getRandomProcessingDelayMs = (
  random: () => number = Math.random,
): number => {
  const randomValue = random();

  if (randomValue <= 0) {
    return MIN_PROCESSING_DELAY_MS;
  }

  if (randomValue >= 1) {
    return MAX_PROCESSING_DELAY_MS;
  }

  return (
    MIN_PROCESSING_DELAY_MS +
    Math.floor(
      randomValue * (MAX_PROCESSING_DELAY_MS - MIN_PROCESSING_DELAY_MS + 1),
    )
  );
};

@Injectable()
export class ProcessNextReportRunUseCase {
  constructor(
    private readonly reportRunQueue: ReportRunQueueService,
    private readonly reportRunner: ReportRunnerService,
    private readonly reportArtifactStorage: ReportArtifactStorageService,
    private readonly reportRunsRepository: ReportRunsRepository,
    @Optional()
    @Inject(PROCESSING_DELAY_PROVIDER)
    private readonly delayProvider: ProcessingDelayProvider = {
      getDelayMs: getRandomProcessingDelayMs,
      sleep,
    },
  ) {}

  async execute(): Promise<ReportRun | null> {
    const run = await this.reportRunQueue.claimNextQueued();

    if (!run) {
      return null;
    }

    try {
      const delayMs = this.delayProvider.getDelayMs();
      await this.delayProvider.sleep(delayMs);

      const artifact = await this.reportRunner.run(run);
      const storedArtifact = await this.reportArtifactStorage.save(
        run.reportId,
        run.id,
        artifact,
      );

      return await this.reportRunsRepository.markSucceeded(run, storedArtifact);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected report processing error';

      return this.reportRunsRepository.markFailed(run, message);
    }
  }
}
