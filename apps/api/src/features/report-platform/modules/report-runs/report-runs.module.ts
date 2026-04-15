import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportRunsController } from '../../api/controllers/report-runs.controller';
import { ReportArtifactStorageService } from '../../application/services/report-artifact-storage.service';
import { ReportRunQueueService } from '../../application/services/report-run-queue.service';
import { ReportRunnerService } from '../../application/services/report-runner.service';
import { CreateReportRunUseCase } from '../../application/use-cases/create-report-run.use-case';
import { DownloadReportArtifactUseCase } from '../../application/use-cases/download-report-artifact.use-case';
import { GetReportRunUseCase } from '../../application/use-cases/get-report-run.use-case';
import { ListReportRunsUseCase } from '../../application/use-cases/list-report-runs.use-case';
import { ProcessNextReportRunUseCase } from '../../application/use-cases/process-next-report-run.use-case';
import { RecoverStaleReportRunsUseCase } from '../../application/use-cases/recover-stale-report-runs.use-case';
import { ReportRun } from '../../domain/entities/report-run.entity';
import { ReportRunsRepository } from '../../infrastructure/repositories/report-runs.repository';
import { ReportsCoreModule } from '../reports';

@Module({
  imports: [TypeOrmModule.forFeature([ReportRun]), ReportsCoreModule],
  controllers: [ReportRunsController],
  providers: [
    ReportRunsRepository,
    ReportArtifactStorageService,
    ReportRunQueueService,
    ReportRunnerService,
    CreateReportRunUseCase,
    ListReportRunsUseCase,
    GetReportRunUseCase,
    DownloadReportArtifactUseCase,
    ProcessNextReportRunUseCase,
    RecoverStaleReportRunsUseCase,
  ],
  exports: [
    CreateReportRunUseCase,
    ListReportRunsUseCase,
    GetReportRunUseCase,
    DownloadReportArtifactUseCase,
    ProcessNextReportRunUseCase,
    RecoverStaleReportRunsUseCase,
  ],
})
export class ReportRunsModule {}
