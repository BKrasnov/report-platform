export type RefreshLoopStepResult = 'continue' | 'stop';

export type RefreshLoopStep = () => RefreshLoopStepResult | Promise<RefreshLoopStepResult>;

export interface RefreshLoop {
  start(step: RefreshLoopStep): void;
  stop(): void;
}

export class TimeoutRefreshLoop implements RefreshLoop {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;

  constructor(private readonly intervalMs: number) {}

  start(step: RefreshLoopStep): void {
    this.stop();
    this.running = true;
    this.schedule(step);
  }

  stop(): void {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private schedule(step: RefreshLoopStep): void {
    if (!this.running) {
      return;
    }

    this.timer = setTimeout(() => {
      void this.executeStep(step);
    }, this.intervalMs);
  }

  private async executeStep(step: RefreshLoopStep): Promise<void> {
    if (!this.running) {
      return;
    }

    let result: RefreshLoopStepResult = 'continue';
    try {
      result = await step();
    } catch {
      result = 'continue';
    }

    if (!this.running) {
      return;
    }

    if (result === 'stop') {
      this.stop();
      return;
    }

    this.schedule(step);
  }
}
