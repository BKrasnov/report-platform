import { Injectable } from '@nestjs/common';
import type { ReportRun } from '../../domain/entities/report-run.entity';
import type { ReportArtifact } from '../../domain/types/report-artifact';
import { ReportRegistryService } from './report-registry.service';

@Injectable()
export class ReportRunnerService {
  constructor(private readonly reportRegistry: ReportRegistryService) {}

  async run(run: Pick<ReportRun, 'reportId' | 'params'>): Promise<ReportArtifact> {
    const report = this.reportRegistry.getById(run.reportId);
    const params = report.paramsSchema.parse(run.params);

    return report.generate(params);
  }
}
