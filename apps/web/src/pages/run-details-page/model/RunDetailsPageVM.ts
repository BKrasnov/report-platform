import { REPORT_RUN_STATUSES, type ReportRunView } from '@report-platform/shared';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { ViewModelBase, type ViewModelParams } from 'mobx-view-model';

import type { ReportRunStore } from '@/entities/report-run';
import { downloadReportModel } from '@/features/download-report-artifact';
import { refreshReportRunsModel } from '@/features/refresh-report-runs';
import {
  type RefreshLoop,
  type RefreshLoopStepResult,
  TimeoutRefreshLoop,
} from '@/shared/lib/TimeoutRefreshLoop';

const RUN_POLL_INTERVAL_MS = 5_000;

type Deps = {
  runsStore: Pick<ReportRunStore, 'getById' | 'loadById'>;
  download: (runId: string) => Promise<void>;
};

type RunDetailsPayload = {
  runId: string;
};

type LoadOptions = {
  force?: boolean;
};

export class RunDetailsPageVM extends ViewModelBase<RunDetailsPayload> {
  @observable
  run: ReportRunView | null = null;

  @observable
  isLoading = false;

  @observable
  isDownloading = false;

  @observable
  error: string | null = null;

  private trackedRunId: string | null = null;
  private readonly refreshLoop: RefreshLoop;

  constructor(
    private readonly deps: Deps,
    vmParams: ViewModelParams<RunDetailsPayload>
  ) {
    super(vmParams);
    makeObservable(this);
    this.refreshLoop = new TimeoutRefreshLoop(RUN_POLL_INTERVAL_MS);
  }

  @computed
  get canDownload(): boolean {
    return downloadReportModel.utils.canDownloadReportArtifact(this.run?.status);
  }

  protected override didMount(): void {
    if (this.payload.runId) {
      void this.startPollingForRun(this.payload.runId);
    }
  }

  protected override didUnmount(): void {
    this.stopAutoRefresh();
  }

  override payloadChanged(payload: RunDetailsPayload, prevPayload: RunDetailsPayload): void {
    super.payloadChanged(payload, prevPayload);

    if (payload.runId === prevPayload.runId) {
      return;
    }

    this.stopAutoRefresh();

    if (!payload.runId) {
      runInAction(() => {
        this.run = null;
        this.error = 'Запуск не выбран';
      });
      return;
    }

    void this.startPollingForRun(payload.runId);
  }

  @action.bound
  async load(runId = this.payload.runId, options: LoadOptions = {}): Promise<void> {
    if (!runId) {
      runInAction(() => {
        this.run = null;
        this.error = 'Запуск не выбран';
      });
      return;
    }

    if (!options.force) {
      const cachedRun = this.deps.runsStore.getById(runId);
      if (cachedRun) {
        runInAction(() => {
          this.run = cachedRun;
          this.error = null;
        });
        return;
      }
    }

    const shouldShowBlockingLoader = !this.run || this.run.id !== runId;

    if (shouldShowBlockingLoader) {
      runInAction(() => {
        this.isLoading = true;
        this.error = null;
      });
    }

    try {
      const run = await this.deps.runsStore.loadById(runId, options);
      runInAction(() => {
        this.run = run;
        this.error = null;
      });
    } catch {
      runInAction(() => {
        this.error = 'Не удалось загрузить детали запуска';
      });
    } finally {
      if (shouldShowBlockingLoader) {
        runInAction(() => {
          this.isLoading = false;
        });
      }
    }
  }

  @action.bound
  async refresh(): Promise<void> {
    await refreshReportRunsModel.utils.refreshReportRuns(() =>
      this.load(this.payload.runId, { force: true })
    );
  }

  @action.bound
  async download(): Promise<void> {
    if (!this.run || !this.canDownload) {
      return;
    }

    runInAction(() => {
      this.isDownloading = true;
      this.error = null;
    });

    try {
      await this.deps.download(this.run.id);
    } catch {
      runInAction(() => {
        this.error = 'Не удалось скачать файл результата';
      });
    } finally {
      runInAction(() => {
        this.isDownloading = false;
      });
    }
  }

  private async startPollingForRun(runId: string): Promise<void> {
    this.stopAutoRefresh();
    this.trackedRunId = runId;

    await this.load(runId);

    if (!this.isTrackingRun(runId) || this.isTerminalStatus(this.run?.status)) {
      this.stopAutoRefresh();
      return;
    }

    this.refreshLoop.start(async (): Promise<RefreshLoopStepResult> => {
      if (!this.isTrackingRun(runId)) {
        return 'stop';
      }

      await this.load(runId, { force: true });

      if (!this.isTrackingRun(runId) || this.isTerminalStatus(this.run?.status)) {
        this.stopAutoRefresh();
        return 'stop';
      }

      return 'continue';
    });
  }

  private stopAutoRefresh(): void {
    this.trackedRunId = null;
    this.refreshLoop.stop();
  }

  private isTerminalStatus(status: ReportRunView['status'] | undefined): boolean {
    return status === REPORT_RUN_STATUSES.succeeded || status === REPORT_RUN_STATUSES.failed;
  }

  private isTrackingRun(runId: string): boolean {
    return this.trackedRunId === runId;
  }
}
