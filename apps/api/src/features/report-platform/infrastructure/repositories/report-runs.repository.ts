import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  REPORT_RUN_STATUSES,
  type ReportId,
  type ReportRunStatus,
} from '@report-platform/shared';
import { DataSource, Repository } from 'typeorm';
import { ReportRun } from '../../domain/entities/report-run.entity';

export const CLAIM_NEXT_QUEUED_REPORT_RUN_SQL = `
  WITH next AS (
    SELECT id
    FROM report_runs
    WHERE status = $1
    ORDER BY created_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT 1
  )
  UPDATE report_runs
  SET
    status = $2,
    started_at = now(),
    finished_at = NULL,
    error_message = NULL,
    updated_at = now()
  WHERE id = (SELECT id FROM next)
  RETURNING id
`;

export const FAIL_STALE_RUNNING_REPORT_RUNS_SQL = `
  UPDATE report_runs
  SET
    status = $2,
    error_message = $4,
    finished_at = now(),
    updated_at = now()
  WHERE status = $1
    AND started_at IS NOT NULL
    AND started_at < $3
  RETURNING id
`;

export type CreateReportRunInput = {
  reportId: ReportId;
  name: string;
  params: Record<string, unknown>;
};

export type ListReportRunsFilter = {
  status?: ReportRunStatus;
  reportId?: ReportId;
  limit: number;
  offset: number;
};

export type StoredReportArtifactInput = {
  filePath: string;
  fileName: string;
  contentType: string;
};

@Injectable()
export class ReportRunsRepository {
  constructor(
    @InjectRepository(ReportRun)
    private readonly repository: Repository<ReportRun>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  createQueued(input: CreateReportRunInput): Promise<ReportRun> {
    return this.repository.save(
      this.repository.create({
        reportId: input.reportId,
        name: input.name,
        params: input.params,
        status: REPORT_RUN_STATUSES.queued,
      }),
    );
  }

  findById(id: string): Promise<ReportRun | null> {
    return this.repository.findOne({ where: { id } });
  }

  findMany(filter: ListReportRunsFilter): Promise<ReportRun[]> {
    const query = this.repository
      .createQueryBuilder('run')
      .orderBy('run.createdAt', 'DESC')
      .take(filter.limit)
      .skip(filter.offset);

    if (filter.status) {
      query.andWhere('run.status = :status', { status: filter.status });
    }

    if (filter.reportId) {
      query.andWhere('run.reportId = :reportId', { reportId: filter.reportId });
    }

    return query.getMany();
  }

  async claimNextQueued(): Promise<ReportRun | null> {
    const rawResult = await this.dataSource.query(CLAIM_NEXT_QUEUED_REPORT_RUN_SQL, [
      REPORT_RUN_STATUSES.queued,
      REPORT_RUN_STATUSES.running,
    ]);
    const rows = this.extractRows<{ id: string }>(rawResult);
    const row = rows[0];

    if (!row?.id) {
      return null;
    }

    return this.repository.findOneByOrFail({ id: row.id });
  }

  async markStaleRunningAsFailed(
    staleBefore: Date,
    errorMessage: string,
  ): Promise<number> {
    const rawResult = await this.dataSource.query(FAIL_STALE_RUNNING_REPORT_RUNS_SQL, [
      REPORT_RUN_STATUSES.running,
      REPORT_RUN_STATUSES.failed,
      staleBefore,
      errorMessage,
    ]);
    const rows = this.extractRows<{ id: string }>(rawResult);

    return rows.length;
  }

  markSucceeded(
    run: ReportRun,
    artifact: StoredReportArtifactInput,
  ): Promise<ReportRun> {
    return this.repository.save({
      ...run,
      status: REPORT_RUN_STATUSES.succeeded,
      resultFilePath: artifact.filePath,
      resultFileName: artifact.fileName,
      resultContentType: artifact.contentType,
      errorMessage: null,
      finishedAt: new Date(),
    });
  }

  markFailed(run: ReportRun, errorMessage: string): Promise<ReportRun> {
    return this.repository.save({
      ...run,
      status: REPORT_RUN_STATUSES.failed,
      errorMessage,
      finishedAt: new Date(),
    });
  }

  private extractRows<T extends object>(rawResult: unknown): T[] {
    if (Array.isArray(rawResult)) {
      if (rawResult.length === 0) {
        return [];
      }

      if (Array.isArray(rawResult[0])) {
        return rawResult[0] as T[];
      }

      if (typeof rawResult[0] === 'object' && rawResult[0] !== null) {
        return rawResult as T[];
      }

      return [];
    }

    if (
      rawResult &&
      typeof rawResult === 'object' &&
      'rows' in rawResult &&
      Array.isArray((rawResult as { rows: unknown }).rows)
    ) {
      return (rawResult as { rows: T[] }).rows;
    }

    return [];
  }
}
