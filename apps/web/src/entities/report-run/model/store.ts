import type { ReportRunView } from '@report-platform/shared';
import { action, makeObservable, observable, runInAction } from 'mobx';

type LoadOptions = {
  force?: boolean;
};

type Deps = {
  getAll: (options?: LoadOptions) => Promise<ReportRunView[]>;
  getById: (runId: string, options?: LoadOptions) => Promise<ReportRunView>;
};

export class ReportRunStore {
  @observable items: ReportRunView[] = [];
  @observable isListLoading = false;

  private itemsById = new Map<string, ReportRunView>();
  private isListLoaded = false;
  private pendingListLoad: Promise<ReportRunView[]> | null = null;
  private pendingByIdLoads = new Map<string, Promise<ReportRunView>>();

  constructor(private readonly deps: Deps) {
    makeObservable(this);
  }

  getById(runId: string): ReportRunView | null {
    return this.itemsById.get(runId) ?? null;
  }

  @action.bound
  async loadAll(options: LoadOptions = {}): Promise<ReportRunView[]> {
    if (this.pendingListLoad && !options.force) {
      return this.pendingListLoad;
    }
    if (this.isListLoaded && !options.force) {
      return this.items;
    }

    this.pendingListLoad = this.performLoadAll(options);
    return this.pendingListLoad;
  }

  @action.bound
  async loadById(runId: string, options: LoadOptions = {}): Promise<ReportRunView> {
    const cachedRun = this.itemsById.get(runId);
    if (cachedRun && !options.force) {
      return cachedRun;
    }

    const pendingRun = this.pendingByIdLoads.get(runId);
    if (pendingRun && !options.force) {
      return pendingRun;
    }

    const request = this.deps.getById(runId, options);
    this.pendingByIdLoads.set(runId, request);

    try {
      const run = await request;
      runInAction(() => {
        this.upsertRun(run);
      });

      return run;
    } finally {
      this.pendingByIdLoads.delete(runId);
    }
  }

  private async performLoadAll(options: LoadOptions): Promise<ReportRunView[]> {
    runInAction(() => {
      this.isListLoading = true;
    });

    try {
      const runs = await this.deps.getAll(options);
      runInAction(() => {
        this.items = runs;
        runs.forEach((run) => {
          this.itemsById.set(run.id, run);
        });
        this.isListLoaded = true;
      });

      return runs;
    } finally {
      runInAction(() => {
        this.isListLoading = false;
      });
      this.pendingListLoad = null;
    }
  }

  private upsertRun(run: ReportRunView): void {
    this.itemsById.set(run.id, run);
    const index = this.items.findIndex((item) => item.id === run.id);

    if (index >= 0) {
      this.items[index] = run;
      return;
    }

    this.items.push(run);
  }
}
