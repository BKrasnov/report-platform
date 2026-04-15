import { Module } from '@nestjs/common';
import { ReportsController } from '../../api/controllers/reports.controller';
import { ListReportsUseCase } from '../../application/use-cases/list-reports.use-case';
import { ReportsCoreModule } from './reports-core.module';

@Module({
  imports: [ReportsCoreModule],
  controllers: [ReportsController],
  providers: [ListReportsUseCase],
  exports: [ReportsCoreModule, ListReportsUseCase],
})
export class ReportsModule {}
