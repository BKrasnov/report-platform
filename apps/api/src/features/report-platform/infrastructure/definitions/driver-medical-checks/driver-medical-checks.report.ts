import { Injectable } from '@nestjs/common';
import {
  driverMedicalChecksParamsSchema,
  REPORT_FORMATS,
  REPORT_IDS,
  type DriverMedicalChecksParams,
} from '@report-platform/shared';
import type { ReportDefinition } from '../../../domain/types/report-definition';
import type { ReportArtifact } from '../../../domain/types/report-artifact';
import { XlsxRendererService } from '../../renderers/xlsx-renderer.service';
import { MedicalChecksRepository } from '../../repositories/medical-checks.repository';
import { mapDriverMedicalChecksRows } from './driver-medical-checks.mapper';

@Injectable()
export class DriverMedicalChecksReport
  implements ReportDefinition<DriverMedicalChecksParams>
{
  readonly id = REPORT_IDS.driverMedicalChecks;
  readonly title = 'Driver Medical Checks';
  readonly description = 'Detailed medical checks export by period and company';
  readonly format = REPORT_FORMATS.xlsx;
  readonly paramsSchema = driverMedicalChecksParamsSchema;

  constructor(
    private readonly medicalChecksRepository: MedicalChecksRepository,
    private readonly xlsxRenderer: XlsxRendererService,
  ) {}

  async generate(params: DriverMedicalChecksParams): Promise<ReportArtifact> {
    const rows = await this.medicalChecksRepository.findDriverChecks(params);

    return this.xlsxRenderer.renderDriverMedicalChecks({
      rows: mapDriverMedicalChecksRows(rows),
      params,
    });
  }
}
