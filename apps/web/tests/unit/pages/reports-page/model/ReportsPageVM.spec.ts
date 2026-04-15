import { type CompanyView, REPORT_IDS, type ReportView } from '@report-platform/shared';
import { ViewModelStoreBase } from 'mobx-view-model';
import { describe, expect, it, vi } from 'vitest';

import { createTestViewModelParams } from '../../../utils/create-test-view-model-params';

import { ReportsPageVM } from '@/pages/reports-page/model/ReportsPageVM';
import { HttpError } from '@/shared/api/http-error';
import { routerBuilder } from '@/shared/lib/router';
import { ReportCreateFormVM } from '@/widgets/report/create/model/FormVM';

type ReferenceStore<T> = {
  items: T[];
  load: () => Promise<void>;
};

function createReferenceStore<T>(items: T[]): {
  store: ReferenceStore<T>;
  load: ReturnType<typeof vi.fn>;
} {
  const load = vi.fn().mockResolvedValue(undefined);

  return {
    store: {
      items,
      load,
    },
    load,
  };
}

describe('ReportsPageVM', () => {
  it('loads reports and redirects after successful create', async () => {
    const reports: ReportView[] = [
      {
        id: REPORT_IDS.driverMedicalChecks,
        title: 'Driver',
        description: '',
        format: 'xlsx',
      },
    ];
    const companies: CompanyView[] = [
      {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'Company',
      },
    ];
    const reportsStore = createReferenceStore(reports);
    const companiesStore = createReferenceStore(companies);
    const createRun = vi.fn().mockResolvedValue({ id: 'run-1' });
    const redirect = vi.fn().mockResolvedValue('/runs/run-1');

    const vm = new ReportsPageVM(
      {
        reportsStore: reportsStore.store,
        companiesStore: companiesStore.store,
        createRun,
        redirect,
      },
      createTestViewModelParams({})
    );

    await vm.load();
    await vm.createRun({
      reportId: REPORT_IDS.driverMedicalChecks,
      name: 'April run',
      from: '2026-01-01',
      to: '2026-01-31',
      companyId: '',
    });

    expect(vm.reports).toHaveLength(1);
    expect(vm.companies).toHaveLength(1);
    expect(reportsStore.load).toHaveBeenCalledTimes(1);
    expect(companiesStore.load).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(routerBuilder.runDetails({ runId: 'run-1' }));
  });

  it('validates dates and company id before create run request', async () => {
    const createRun = vi.fn();
    const reportsStore = createReferenceStore([]);
    const companiesStore = createReferenceStore([]);

    const vm = new ReportsPageVM(
      {
        reportsStore: reportsStore.store,
        companiesStore: companiesStore.store,
        createRun,
        redirect: vi.fn(),
      },
      createTestViewModelParams({})
    );

    await vm.createRun({
      reportId: REPORT_IDS.driverMedicalChecks,
      name: '',
      from: '20000-01-12',
      to: '123213-03-12',
      companyId: '1',
    });

    expect(createRun).not.toHaveBeenCalled();
    expect(vm.error).toBeTruthy();
  });

  it('shows readable validation details from backend', async () => {
    const reportsStore = createReferenceStore([]);
    const companiesStore = createReferenceStore([]);

    const vm = new ReportsPageVM(
      {
        reportsStore: reportsStore.store,
        companiesStore: companiesStore.store,
        createRun: vi.fn().mockRejectedValue(
          new HttpError(400, {
            error: {
              code: 'REPORT_PARAMS_INVALID',
              message: 'Report parameters are invalid',
              details: [
                {
                  path: ['from'],
                  message: 'Invalid date',
                  code: 'invalid_string',
                },
                {
                  path: ['companyId'],
                  message: 'Invalid uuid',
                  code: 'invalid_string',
                },
              ],
            },
          })
        ),
        redirect: vi.fn(),
      },
      createTestViewModelParams({})
    );

    await vm.createRun({
      reportId: REPORT_IDS.driverMedicalChecks,
      name: 'April run',
      from: '2026-01-01',
      to: '2026-01-31',
      companyId: '',
    });

    expect(vm.error).toBeTruthy();
    expect(vm.error).toContain('UUID');
    expect(vm.error).toContain('\n');
  });

  it('resets report create form VM after successful create via shared view model store', async () => {
    const viewModelsStore = new ViewModelStoreBase();
    const formVm = new ReportCreateFormVM(
      createTestViewModelParams(
        {
          companies: [],
          onCreateRun: vi.fn().mockResolvedValue(undefined),
        },
        { id: 'report-create-form-vm', viewModels: viewModelsStore }
      )
    );
    formVm.setFrom('2026-01-01');
    formVm.setTo('2026-01-31');
    formVm.setName('April run');
    formVm.setCompanyId('f47ac10b-58cc-4372-a567-0e02b2c3d479');

    await viewModelsStore.attach(formVm);

    const vm = new ReportsPageVM(
      {
        reportsStore: createReferenceStore([]).store,
        companiesStore: createReferenceStore([]).store,
        createRun: vi.fn().mockResolvedValue({ id: 'run-1' }),
        redirect: vi.fn().mockResolvedValue('/runs/run-1'),
      },
      createTestViewModelParams({}, { viewModels: viewModelsStore })
    );

    await vm.createRun({
      reportId: REPORT_IDS.driverMedicalChecks,
      name: 'April run',
      from: '2026-01-01',
      to: '2026-01-31',
      companyId: '',
    });

    expect(formVm.from).toBe('');
    expect(formVm.to).toBe('');
    expect(formVm.name).toBe('');
    expect(formVm.companyId).toBe('');
    expect(formVm.reportId).toBe(REPORT_IDS.driverMedicalChecks);
  });
});
