import { REPORT_IDS, type ReportId } from '@report-platform/shared';
import { action, computed, makeObservable, observable } from 'mobx';
import { ViewModelBase, type ViewModelParams } from 'mobx-view-model';

import type { CreateRunForm } from './types';

type CompanyOption = {
  id: string;
  name: string;
};

export type ReportCreateFormPayload = {
  companies: CompanyOption[];
  onCreateRun: (form: CreateRunForm) => Promise<void>;
};

export class ReportCreateFormVM extends ViewModelBase<ReportCreateFormPayload> {
  @observable reportId: ReportId = REPORT_IDS.driverMedicalChecks;
  @observable name = '';
  @observable from = '';
  @observable to = '';
  @observable companyId = '';

  constructor(vmParams: ViewModelParams<ReportCreateFormPayload>) {
    super(vmParams);
    makeObservable(this);
  }

  @computed
  get companies(): CompanyOption[] {
    return this.payload.companies;
  }

  @computed
  get hasCompanies(): boolean {
    return this.companies.length > 0;
  }

  @action.bound
  setReportId(value: ReportId): void {
    this.reportId = value;
  }

  @action.bound
  setName(value: string): void {
    this.name = value;
  }

  @action.bound
  setFrom(value: string): void {
    this.from = value;
  }

  @action.bound
  setTo(value: string): void {
    this.to = value;
  }

  @action.bound
  setDateRange(from: string, to: string): void {
    this.from = from;
    this.to = to;
  }

  @action.bound
  setCompanyId(value: string): void {
    this.companyId = value;
  }

  @action.bound
  reset(): void {
    this.reportId = REPORT_IDS.driverMedicalChecks;
    this.name = '';
    this.from = '';
    this.to = '';
    this.companyId = '';
  }

  @action.bound
  submit(): Promise<void> {
    return this.payload.onCreateRun({
      reportId: this.reportId,
      name: this.name,
      from: this.from,
      to: this.to,
      companyId: this.companyId,
    });
  }
}
