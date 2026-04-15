import type { ReportView } from '@report-platform/shared';
import { action, makeObservable, observable, runInAction } from 'mobx';

type Deps = {
  getAll: (options?: LoadOptions) => Promise<ReportView[]>;
};

type LoadOptions = {
  force?: boolean;
};

export class ReportStore {
  @observable items: ReportView[] = [];
  @observable isLoading = false;
  private isLoaded = false;
  private pendingLoad: Promise<void> | null = null;

  constructor(private readonly deps: Deps) {
    makeObservable(this);
  }

  @action.bound
  async load(options: LoadOptions = {}): Promise<void> {
    if (this.pendingLoad) {
      return this.pendingLoad;
    }
    if (this.isLoaded && !options.force) {
      return;
    }

    this.pendingLoad = this.performLoad(options);
    return this.pendingLoad;
  }

  private async performLoad(options: LoadOptions): Promise<void> {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      const reports = await this.deps.getAll(options);
      runInAction(() => {
        this.items = reports;
        this.isLoaded = true;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
      this.pendingLoad = null;
    }
  }
}
