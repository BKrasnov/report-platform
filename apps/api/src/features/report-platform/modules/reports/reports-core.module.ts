import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  REPORT_DEFINITIONS,
  ReportRegistryService,
} from '../../application/services/report-registry.service';
import { Driver } from '../../domain/entities/driver.entity';
import { MedicalCheck } from '../../domain/entities/medical-check.entity';
import { CompanySummaryReport } from '../../infrastructure/definitions/company-summary/company-summary.report';
import { DriverMedicalChecksReport } from '../../infrastructure/definitions/driver-medical-checks/driver-medical-checks.report';
import { DriversRepository } from '../../infrastructure/repositories/drivers.repository';
import { MedicalChecksRepository } from '../../infrastructure/repositories/medical-checks.repository';
import { PdfRendererService } from '../../infrastructure/renderers/pdf-renderer.service';
import { XlsxRendererService } from '../../infrastructure/renderers/xlsx-renderer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, MedicalCheck])],
  providers: [
    DriversRepository,
    MedicalChecksRepository,
    XlsxRendererService,
    PdfRendererService,
    DriverMedicalChecksReport,
    CompanySummaryReport,
    {
      provide: REPORT_DEFINITIONS,
      useFactory: (
        driverMedicalChecks: DriverMedicalChecksReport,
        companySummary: CompanySummaryReport,
      ) => [driverMedicalChecks, companySummary],
      inject: [DriverMedicalChecksReport, CompanySummaryReport],
    },
    ReportRegistryService,
  ],
  exports: [ReportRegistryService],
})
export class ReportsCoreModule {}
