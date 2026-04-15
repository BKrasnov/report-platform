import type { ReportRunView } from '@report-platform/shared';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { ViewModelBase, type ViewModelParams } from 'mobx-view-model';

import type { ReportRunStore } from '@/entities/report-run/model/store';
import { refreshReportRunsModel } from '@/features/refresh-report-runs';

type Deps = {
  runsStore: Pick<ReportRunStore, 'items' | 'loadAll'>;
};

type LoadOptions = {
  force?: boolean;
};

export class RunsPageVM extends ViewModelBase<Record<string, never>> {
  @observable runs: ReportRunView[] = [];
  @observable isLoading = false;
  @observable error: string | null = null;

  constructor(
    private readonly deps: Deps,
    vmParams: ViewModelParams<Record<string, never>>
  ) {
    super(vmParams);
    makeObservable(this);
  }

  @computed
  get stats(): { queued: number; running: number; done: number } {
    return this.runs.reduce(
      (acc, run) => {
        if (run.status === 'queued') acc.queued += 1;
        else if (run.status === 'running') acc.running += 1;
        else if (run.status === 'succeeded') acc.done += 1;
        return acc;
      },
      { queued: 0, running: 0, done: 0 }
    );
  }

  protected override didMount(): void {
    void this.load();
  }

  @action.bound
  async load(options: LoadOptions = {}): Promise<void> {
    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      const runs = await this.deps.runsStore.loadAll(options);
      runInAction(() => {
        this.runs = runs;
      });
    } catch {
      runInAction(() => {
        this.error = 'Не удалось загрузить запуски отчетов';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  @action.bound
  async refresh(): Promise<void> {
    await refreshReportRunsModel.utils.refreshReportRuns(() => this.load({ force: true }));
  }
}
