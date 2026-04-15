import { Controller, Get, Param, Post, Body, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { createReadStream } from 'node:fs';
import { CreateReportRunUseCase } from '../../application/use-cases/create-report-run.use-case';
import { DownloadReportArtifactUseCase } from '../../application/use-cases/download-report-artifact.use-case';
import { GetReportRunUseCase } from '../../application/use-cases/get-report-run.use-case';
import { ListReportRunsUseCase } from '../../application/use-cases/list-report-runs.use-case';
import { mapReportRunToViewModel } from '../mappers/report-run.mapper';
import type { ReportRunViewModel } from '../view-models/report-run.view-model';
import { CreateReportRunDto } from '../dto/create-report-run.dto';
import { ListReportRunsQueryDto } from '../dto/list-report-runs-query.dto';

@Controller('report-runs')
export class ReportRunsController {
  constructor(
    private readonly createReportRunUseCase: CreateReportRunUseCase,
    private readonly listReportRunsUseCase: ListReportRunsUseCase,
    private readonly getReportRunUseCase: GetReportRunUseCase,
    private readonly downloadReportArtifactUseCase: DownloadReportArtifactUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateReportRunDto): Promise<ReportRunViewModel> {
    const run = await this.createReportRunUseCase.execute({
      reportId: body.reportId,
      name: body.name,
      params: body.params,
    });

    return mapReportRunToViewModel(run);
  }

  @Get()
  async list(@Query() query: ListReportRunsQueryDto): Promise<ReportRunViewModel[]> {
    const runs = await this.listReportRunsUseCase.execute({
      status: query.status as never,
      reportId: query.reportId as never,
      limit: this.parseNumber(query.limit, 20),
      offset: this.parseNumber(query.offset, 0),
    });

    return runs.map(mapReportRunToViewModel);
  }

  @Get(':runId')
  async get(@Param('runId') runId: string): Promise<ReportRunViewModel> {
    const run = await this.getReportRunUseCase.execute(runId);

    return mapReportRunToViewModel(run);
  }

  @Get(':runId/download')
  async download(
    @Param('runId') runId: string,
    @Res() response: Response,
  ): Promise<void> {
    const artifact = await this.downloadReportArtifactUseCase.execute(runId);

    response.setHeader('Content-Type', artifact.contentType);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${artifact.fileName}"`,
    );

    await new Promise<void>((resolve, reject) => {
      const stream = createReadStream(artifact.filePath);
      stream.on('error', reject);
      response.on('close', resolve);
      stream.pipe(response);
    });
  }

  private parseNumber(value: number | string | undefined, fallback: number): number {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);

      return Number.isFinite(parsed) ? parsed : fallback;
    }

    return fallback;
  }
}
