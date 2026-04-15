import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalCheckStatus } from '../../domain/entities/medical-check.entity';
import { MedicalCheck } from '../../domain/entities/medical-check.entity';

export type ReportDateRangeFilter = {
  from: string;
  to: string;
  companyId?: string;
};

export type DriverCheckRow = {
  checkedAt: Date;
  companyName: string;
  driverFullName: string;
  personnelNumber: string;
  status: MedicalCheckStatus;
  doctorName: string;
  notes: string | null;
};

export type CompanySummaryRow = {
  companyId: string;
  companyName: string;
  totalCount: number;
  allowedCount: number;
  rejectedCount: number;
  needsReviewCount: number;
};

type DriverCheckRawRow = {
  checked_at: Date;
  company_name: string;
  driver_full_name: string;
  personnel_number: string;
  status: MedicalCheckStatus;
  doctor_name: string;
  notes: string | null;
};

type CompanySummaryRawRow = {
  company_id: string;
  company_name: string;
  total_count: string;
  allowed_count: string;
  rejected_count: string;
  needs_review_count: string;
};

@Injectable()
export class MedicalChecksRepository {
  constructor(
    @InjectRepository(MedicalCheck)
    private readonly repository: Repository<MedicalCheck>,
  ) {}

  async findDriverChecks(
    filter: ReportDateRangeFilter,
  ): Promise<DriverCheckRow[]> {
    const query = this.repository
      .createQueryBuilder('check')
      .innerJoin('check.driver', 'driver')
      .innerJoin('driver.company', 'company')
      .select([
        'check.checked_at AS checked_at',
        'company.name AS company_name',
        'driver.full_name AS driver_full_name',
        'driver.personnel_number AS personnel_number',
        'check.status AS status',
        'check.doctor_name AS doctor_name',
        'check.notes AS notes',
      ])
      .where('check.checked_at >= :from', { from: filter.from })
      .andWhere('check.checked_at <= :to', { to: filter.to })
      .orderBy('check.checked_at', 'ASC');

    if (filter.companyId) {
      query.andWhere('company.id = :companyId', { companyId: filter.companyId });
    }

    const rows = await query.getRawMany<DriverCheckRawRow>();

    return rows.map((row) => ({
      checkedAt: row.checked_at,
      companyName: row.company_name,
      driverFullName: row.driver_full_name,
      personnelNumber: row.personnel_number,
      status: row.status,
      doctorName: row.doctor_name,
      notes: row.notes,
    }));
  }

  async getCompanySummary(
    filter: ReportDateRangeFilter,
  ): Promise<CompanySummaryRow[]> {
    const query = this.repository
      .createQueryBuilder('check')
      .innerJoin('check.driver', 'driver')
      .innerJoin('driver.company', 'company')
      .select('company.id', 'company_id')
      .addSelect('company.name', 'company_name')
      .addSelect('COUNT(*)', 'total_count')
      .addSelect(
        "COUNT(*) FILTER (WHERE check.status = 'allowed')",
        'allowed_count',
      )
      .addSelect(
        "COUNT(*) FILTER (WHERE check.status = 'rejected')",
        'rejected_count',
      )
      .addSelect(
        "COUNT(*) FILTER (WHERE check.status = 'needs_review')",
        'needs_review_count',
      )
      .where('check.checked_at >= :from', { from: filter.from })
      .andWhere('check.checked_at <= :to', { to: filter.to })
      .groupBy('company.id')
      .addGroupBy('company.name')
      .orderBy('company.name', 'ASC');

    if (filter.companyId) {
      query.andWhere('company.id = :companyId', { companyId: filter.companyId });
    }

    const rows = await query.getRawMany<CompanySummaryRawRow>();

    return rows.map((row) => ({
      companyId: row.company_id,
      companyName: row.company_name,
      totalCount: Number(row.total_count),
      allowedCount: Number(row.allowed_count),
      rejectedCount: Number(row.rejected_count),
      needsReviewCount: Number(row.needs_review_count),
    }));
  }
}
