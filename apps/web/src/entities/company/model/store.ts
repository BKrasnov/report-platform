import type { CompanyView } from '@report-platform/shared';
import { action, makeObservable, observable, runInAction } from 'mobx';

type Deps = {
  getAll: (options?: LoadOptions) => Promise<CompanyView[]>;
};

type LoadOptions = {
  force?: boolean;
};

export class CompanyStore {
  @observable items: CompanyView[] = [];
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
      const companies = await this.deps.getAll(options);
      runInAction(() => {
        this.items = companies;
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
