import { Injectable } from '@nestjs/common';
import type { ReportDefinition } from '../../domain/types/report-definition';
import { ReportRegistryService } from '../services/report-registry.service';

@Injectable()
export class ListReportsUseCase {
  constructor(private readonly reportRegistry: ReportRegistryService) {}

  execute(): ReportDefinition[] {
    return this.reportRegistry.list();
  }
}
