import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import type { ReportArtifact } from '../../domain/types/report-artifact';
import type { CompanySummaryRow } from '../repositories/medical-checks.repository';

export const PDF_CONTENT_TYPE = 'application/pdf';

export type CompanySummaryPdfInput = {
  rows: CompanySummaryRow[];
  params: {
    from: string;
    to: string;
    companyId?: string;
  };
};

@Injectable()
export class PdfRendererService {
  async renderCompanySummary(
    input: CompanySummaryPdfInput,
  ): Promise<ReportArtifact> {
    const document = new PDFDocument({ margin: 48 });
    const chunks: Buffer[] = [];

    document.on('data', (chunk: Buffer) => chunks.push(chunk));

    const finished = new Promise<Buffer>((resolve) => {
      document.on('end', () => resolve(Buffer.concat(chunks)));
    });

    const totals = this.calculateTotals(input.rows);

    document.fontSize(20).text('Company Summary', { underline: true });
    document.moveDown();
    document.fontSize(11).text(`Period: ${input.params.from} - ${input.params.to}`);
    document.moveDown();

    document.fontSize(14).text('Totals');
    document.fontSize(11).text(`Total checks: ${totals.total}`);
    document.text(`Allowed: ${totals.allowed} (${this.percent(totals.allowed, totals.total)}%)`);
    document.text(`Rejected: ${totals.rejected} (${this.percent(totals.rejected, totals.total)}%)`);
    document.text(
      `Needs review: ${totals.needsReview} (${this.percent(totals.needsReview, totals.total)}%)`,
    );
    document.moveDown();

    this.drawDistributionBar(document, totals);

    document.moveDown();
    document.fontSize(14).text('Breakdown by company');
    document.moveDown(0.5);

    for (const row of input.rows) {
      document
        .fontSize(11)
        .text(
          `${row.companyName}: total ${row.totalCount}, allowed ${row.allowedCount}, rejected ${row.rejectedCount}, needs review ${row.needsReviewCount}`,
        );
    }

    document.end();

    return {
      fileName: `company-summary-${input.params.from}-${input.params.to}.pdf`,
      contentType: PDF_CONTENT_TYPE,
      buffer: await finished,
    };
  }

  private calculateTotals(rows: CompanySummaryRow[]): {
    total: number;
    allowed: number;
    rejected: number;
    needsReview: number;
  } {
    return rows.reduce(
      (acc, row) => ({
        total: acc.total + row.totalCount,
        allowed: acc.allowed + row.allowedCount,
        rejected: acc.rejected + row.rejectedCount,
        needsReview: acc.needsReview + row.needsReviewCount,
      }),
      { total: 0, allowed: 0, rejected: 0, needsReview: 0 },
    );
  }

  private drawDistributionBar(
    document: PDFKit.PDFDocument,
    totals: {
      total: number;
      allowed: number;
      rejected: number;
      needsReview: number;
    },
  ): void {
    const x = document.x;
    const y = document.y;
    const width = 420;
    const height = 18;
    const allowedWidth = width * (totals.total === 0 ? 0 : totals.allowed / totals.total);
    const rejectedWidth = width * (totals.total === 0 ? 0 : totals.rejected / totals.total);
    const reviewWidth = width - allowedWidth - rejectedWidth;

    document.rect(x, y, allowedWidth, height).fill('#2e7d32');
    document.rect(x + allowedWidth, y, rejectedWidth, height).fill('#c62828');
    document
      .rect(x + allowedWidth + rejectedWidth, y, reviewWidth, height)
      .fill('#f9a825');
    document.fillColor('#000000').moveDown(2);
  }

  private percent(value: number, total: number): number {
    if (total === 0) {
      return 0;
    }

    return Math.round((value / total) * 100);
  }
}
