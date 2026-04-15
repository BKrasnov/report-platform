import { useMemo } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { REPORT_IDS, type ReportId } from '@report-platform/shared';
import type { ViewModelParams } from 'mobx-view-model';
import { type ViewModelProps, withViewModel } from 'mobx-view-model-react';

import type { CreateRunForm } from '../model';
import type { ReportCreateFormPayload } from '../model/FormVM';
import { ReportCreateFormVM } from '../model/FormVM';

import { ReportDatePresets } from '@/features/report-date-presets';

export type ReportCreateFormWidgetProps = {
  companies: Array<{ id: string; name: string }>;
  isSubmitting: boolean;
  onCreateRun: (form: CreateRunForm) => Promise<void>;
};

type ReportCreateFormViewProps = ViewModelProps<ReportCreateFormVM> & {
  isSubmitting: boolean;
};

const config = {
  factory: (vmParams: ViewModelParams<ReportCreateFormPayload>) => new ReportCreateFormVM(vmParams),
};

const ReportCreateForm = withViewModel(
  ReportCreateFormVM,
  ({ model: vm, isSubmitting }: ReportCreateFormViewProps): JSX.Element => (
    <Stack spacing={1.75}>
      <ReportDatePresets.Buttons onApplyRange={vm.setDateRange} />

      <Stack
        component="form"
        spacing={1.75}
        onSubmit={(event) => {
          event.preventDefault();
          if (!event.currentTarget.reportValidity()) {
            return;
          }

          void vm.submit();
        }}
      >
        <TextField
          select
          label="Тип отчета"
          value={vm.reportId}
          onChange={(event) => vm.setReportId(event.target.value as ReportId)}
          slotProps={{
            select: {
              native: true,
              inputProps: { 'data-testid': 'report-select' },
            },
            inputLabel: {
              shrink: true,
            },
          }}
        >
          <option value={REPORT_IDS.driverMedicalChecks}>Медосмотры водителей</option>
          <option value={REPORT_IDS.companySummary}>Сводка по компании</option>
        </TextField>

        <TextField
          label="Название отчета"
          required
          value={vm.name}
          onChange={(event) => vm.setName(event.target.value)}
          slotProps={{
            htmlInput: {
              maxLength: 120,
              'data-testid': 'run-name-input',
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          label="Дата начала"
          type="date"
          required
          value={vm.from}
          onChange={(event) => vm.setFrom(event.target.value)}
          slotProps={{
            htmlInput: {
              min: '1900-01-01',
              max: '9999-12-31',
              'data-testid': 'from-input',
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          label="Дата окончания"
          type="date"
          required
          value={vm.to}
          onChange={(event) => vm.setTo(event.target.value)}
          slotProps={{
            htmlInput: {
              min: '1900-01-01',
              max: '9999-12-31',
              'data-testid': 'to-input',
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          select
          label="Компания"
          value={vm.companyId}
          onChange={(event) => vm.setCompanyId(event.target.value)}
          disabled={!vm.hasCompanies}
          slotProps={{
            select: {
              native: true,
              inputProps: { 'data-testid': 'company-select' },
            },
            inputLabel: {
              shrink: true,
            },
          }}
        >
          <option value="">Все компании</option>
          {vm.companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </TextField>

        <Button
          data-testid="create-run-button"
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ mt: 1, minHeight: 52 }}
        >
          Создать запуск
        </Button>
      </Stack>
    </Stack>
  ),
  config
);

export const ReportCreateFormWidget = ({
  companies,
  isSubmitting,
  onCreateRun,
}: ReportCreateFormWidgetProps): JSX.Element => {
  const payload = useMemo<ReportCreateFormPayload>(
    () => ({
      companies,
      onCreateRun,
    }),
    [companies, onCreateRun]
  );

  return <ReportCreateForm isSubmitting={isSubmitting} payload={payload} />;
};
