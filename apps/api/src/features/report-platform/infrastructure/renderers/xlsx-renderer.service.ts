import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import type { DriverCheckRow } from '../repositories/medical-checks.repository';
import type { ReportArtifact } from '../../domain/types/report-artifact';

export const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export type DriverMedicalChecksWorkbookInput = {
  rows: DriverCheckRow[];
  params: {
    from: string;
    to: string;
    companyId?: string;
  };
};

@Injectable()
export class XlsxRendererService {
  async renderDriverMedicalChecks(
    input: DriverMedicalChecksWorkbookInput,
  ): Promise<ReportArtifact> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Medical Checks');

    worksheet.columns = [
      { header: 'Checked at', key: 'checkedAt', width: 24 },
      { header: 'Company', key: 'companyName', width: 24 },
      { header: 'Driver', key: 'driverFullName', width: 24 },
      { header: 'Personnel number', key: 'personnelNumber', width: 18 },
      { header: 'Status', key: 'status', width: 16 },
      { header: 'Doctor', key: 'doctorName', width: 24 },
      { header: 'Notes', key: 'notes', width: 36 },
    ];

    worksheet.getRow(1).font = { bold: true };

    for (const row of input.rows) {
      worksheet.addRow({
        checkedAt: row.checkedAt.toISOString(),
        companyName: row.companyName,
        driverFullName: row.driverFullName,
        personnelNumber: row.personnelNumber,
        status: row.status,
        doctorName: row.doctorName,
        notes: row.notes ?? '',
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return {
      fileName: `driver-medical-checks-${input.params.from}-${input.params.to}.xlsx`,
      contentType: XLSX_CONTENT_TYPE,
      buffer: Buffer.from(buffer),
    };
  }
}
