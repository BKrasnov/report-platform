import type { ReportFormat, ReportId } from '@report-platform/shared';
import type { ZodSchema } from 'zod';
import type { ReportArtifact } from './report-artifact';

export type ReportDefinition<TParams = unknown> = {
  readonly id: ReportId;
  readonly title: string;
  readonly description: string;
  readonly format: ReportFormat;
  readonly paramsSchema: ZodSchema<TParams>;
  generate(params: TParams): Promise<ReportArtifact>;
};
