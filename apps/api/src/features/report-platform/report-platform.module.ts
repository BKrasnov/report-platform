import { Module } from '@nestjs/common';
import { CompaniesModule, ReportRunsModule, ReportsModule } from './modules';

@Module({
  imports: [CompaniesModule, ReportsModule, ReportRunsModule],
  exports: [CompaniesModule, ReportsModule, ReportRunsModule],
})
export class ReportPlatformModule {}
