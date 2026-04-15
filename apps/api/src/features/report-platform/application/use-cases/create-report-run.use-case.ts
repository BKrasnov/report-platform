import { Injectable } from '@nestjs/common';
import {
  createReportRunSchema,
  type CreateReportRunRequest,
} from '@report-platform/shared';
import { ZodError } from 'zod';
import { AppError } from '../../../../common/exceptions/app-error';
import type { ReportRun } from '../../domain/entities/report-run.entity';
import { ReportRunsRepository } from '../../infrastructure/repositories/report-runs.repository';
import { ReportRegistryService } from '../services/report-registry.service';

export type CreateReportRunInput = CreateReportRunRequest;

@Injectable()
export class CreateReportRunUseCase {
  constructor(
    private readonly reportRegistry: ReportRegistryService,
    private readonly reportRunsRepository: ReportRunsRepository,
  ) {}

  async execute(input: CreateReportRunInput): Promise<ReportRun> {
    const validatedInput = this.validateInput(input);
    const report = this.reportRegistry.getById(validatedInput.reportId);
    let params: Record<string, unknown>;

    try {
      params = report.paramsSchema.parse(validatedInput.params) as Record<string, unknown>;
    } catch (error) {
      throw new AppError(
        'REPORT_PARAMS_INVALID',
        'Report parameters are invalid',
        400,
        this.getErrorDetails(error),
      );
    }

    return this.reportRunsRepository.createQueued({
      reportId: report.id,
      name: validatedInput.name,
      params,
    });
  }

  private validateInput(input: CreateReportRunInput): CreateReportRunRequest {
    try {
      return createReportRunSchema.parse(input);
    } catch (error) {
      throw new AppError(
        'REPORT_PARAMS_INVALID',
        'Report parameters are invalid',
        400,
        this.getErrorDetails(error),
      );
    }
  }

  private getErrorDetails(error: unknown): unknown {
    if (error instanceof ZodError) {
      return error.issues.map((issue) => ({
        code: issue.code,
        path: issue.path,
        message: issue.message,
      }));
    }

    if (error instanceof Error) {
      return [{ message: error.message }];
    }

    return null;
  }
}
