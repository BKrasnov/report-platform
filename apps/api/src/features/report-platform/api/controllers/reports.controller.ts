import { Controller, Get, Param } from '@nestjs/common';
import { ListReportsUseCase } from '../../application/use-cases/list-reports.use-case';
import { ReportRegistryService } from '../../application/services/report-registry.service';
import { mapReportToViewModel } from '../mappers/report.mapper';
import type { ReportViewModel } from '../view-models/report.view-model';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly listReportsUseCase: ListReportsUseCase,
    private readonly reportRegistry: ReportRegistryService,
  ) {}

  @Get()
  list(): ReportViewModel[] {
    return this.listReportsUseCase.execute().map(mapReportToViewModel);
  }

  @Get(':reportId')
  get(@Param('reportId') reportId: string): ReportViewModel {
    return mapReportToViewModel(this.reportRegistry.getById(reportId));
  }
}
