import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProcessNextReportRunUseCase } from './features/report-platform/application/use-cases/process-next-report-run.use-case';
import { RecoverStaleReportRunsUseCase } from './features/report-platform/application/use-cases/recover-stale-report-runs.use-case';

const logger = new Logger('ReportWorker');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const processNextReportRun = app.get(ProcessNextReportRunUseCase);
  const recoverStaleReportRuns = app.get(RecoverStaleReportRunsUseCase);
  const intervalMs = getPollingIntervalMs();
  let isTickRunning = false;

  logger.log(`Report worker started with ${intervalMs}ms polling interval`);

  const runTick = async (): Promise<void> => {
    if (isTickRunning) {
      return;
    }

    isTickRunning = true;

    try {
      const recovered = await recoverStaleReportRuns.execute();
      if (recovered > 0) {
        logger.warn(`Watchdog moved ${recovered} stale run(s) to failed status`);
      }

      await processNextReportRun.execute();
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Failed to process report run: ${error.message}`, error.stack);
      } else {
        logger.error('Failed to process report run');
      }
    } finally {
      isTickRunning = false;
    }
  };

  const intervalId = setInterval(() => {
    void runTick();
  }, intervalMs);

  void runTick();

  const shutdown = async (): Promise<void> => {
    clearInterval(intervalId);
    await app.close();
    process.exit(0);
  };

  process.once('SIGTERM', () => {
    void shutdown();
  });
  process.once('SIGINT', () => {
    void shutdown();
  });
}

function getPollingIntervalMs(): number {
  const parsed = Number(process.env.WORKER_POLL_INTERVAL_MS ?? 2000);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 2000;
}

void bootstrap();
