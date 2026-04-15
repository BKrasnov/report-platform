import { z } from 'zod';
import { REPORT_IDS } from '../constants/report-ids';

export const createReportRunSchema = z.object({
  reportId: z.nativeEnum(REPORT_IDS),
  name: z.string().trim().min(1).max(120),
  params: z.record(z.unknown()),
});

export type CreateReportRunRequest = z.infer<typeof createReportRunSchema>;
