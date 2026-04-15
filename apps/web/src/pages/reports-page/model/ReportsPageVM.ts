import { type CompanyView, type ReportView } from '@report-platform/shared';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { ViewModelBase, type ViewModelParams } from 'mobx-view-model';

import { routerBuilder } from '@/shared/lib/router';
import { Report } from '@/widgets/report';
import {
  createReportRunModel,
  type CreateRunForm,
  type CreateRunPayload,
} from '@/widgets/report/create';

type RedirectState = ReturnType<typeof routerBuilder.runDetails>;
type RedirectFn = (state: RedirectState) => Promise<unknown>;
type ReferenceStore<T> = {
  items: T[];
  load: () => Promise<void>;
};

type Deps = {
  reportsStore: ReferenceStore<ReportView>;
  companiesStore: ReferenceStore<CompanyView>;
  createRun: (payload: CreateRunPayload) => Promise<{ id: string }>;
  redirect?: RedirectFn;
};

export class ReportsPageVM extends ViewModelBase<Record<string, never>> {
  @observable isLoading = false;
  @observable isSubmitting = false;
  @observable error: string | null = null;

  private redirect: RedirectFn | null;

  constructor(
    private readonly deps: Deps,
    vmParams: ViewModelParams<Record<string, never>>
  ) {
    super(vmParams);
    makeObservable(this);
    this.redirect = deps.redirect ?? null;
  }

  @computed
  get reports(): ReportView[] {
    return this.deps.reportsStore.items;
  }

  @computed
  get companies(): CompanyView[] {
    return this.deps.companiesStore.items;
  }

  protected override didMount(): void {
    void this.load();
  }

  @action.bound
  setRedirect(redirect: RedirectFn): void {
    this.redirect = redirect;
  }

  @action.bound
  async load(): Promise<void> {
    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      await Promise.all([
        this.deps.reportsStore.load(),
        this.deps.companiesStore.load().catch(() => undefined),
      ]);
    } catch {
      runInAction(() => {
        this.error = 'Не удалось загрузить отчеты';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  @action.bound
  async createRun(form: CreateRunForm): Promise<void> {
    const validationError = createReportRunModel.utils.validateCreateRunForm(form, this.companies);
    if (validationError) {
      runInAction(() => {
        this.error = validationError;
      });
      return;
    }

    runInAction(() => {
      this.isSubmitting = true;
      this.error = null;
    });

    try {
      const run = await this.deps.createRun(createReportRunModel.utils.buildCreateRunPayload(form));
      this.viewModels.get(Report.Create.VM)?.reset();

      if (this.redirect) {
        await this.redirect(routerBuilder.runDetails({ runId: run.id }));
      }
    } catch (error) {
      runInAction(() => {
        this.error = createReportRunModel.utils.getCreateRunErrorMessage(error);
      });
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  }
}
