import { Injectable } from '@nestjs/common';
import type { ReportRun } from '../../domain/entities/report-run.entity';
import { ReportRunsRepository } from '../../infrastructure/repositories/report-runs.repository';

@Injectable()
export class ReportRunQueueService {
  constructor(private readonly reportRunsRepository: ReportRunsRepository) {}

  claimNextQueued(): Promise<ReportRun | null> {
    return this.reportRunsRepository.claimNextQueued();
  }
}
