import {
  REPORT_RUN_STATUSES,
  type ReportId,
  type ReportRunStatus,
} from '@report-platform/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'report_runs' })
export class ReportRun {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'report_id', type: 'varchar', length: 120 })
  reportId!: ReportId;

  @Column({ type: 'varchar', length: 120, nullable: true })
  name!: string | null;

  @Column({
    type: 'enum',
    enum: Object.values(REPORT_RUN_STATUSES),
    default: REPORT_RUN_STATUSES.queued,
  })
  status!: ReportRunStatus;

  @Column({ type: 'jsonb' })
  params!: Record<string, unknown>;

  @Column({ name: 'result_file_path', type: 'text', nullable: true })
  resultFilePath!: string | null;

  @Column({ name: 'result_file_name', type: 'varchar', length: 255, nullable: true })
  resultFileName!: string | null;

  @Column({
    name: 'result_content_type',
    type: 'varchar',
    length: 160,
    nullable: true,
  })
  resultContentType!: string | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string | null;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt!: Date | null;

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
