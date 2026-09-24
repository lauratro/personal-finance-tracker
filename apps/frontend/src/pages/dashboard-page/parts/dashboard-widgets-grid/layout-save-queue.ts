import type { DashboardLayoutItem } from '@/pages-apis/dashboard/dashboard-types';

type LayoutSaveQueueOptions = {
  debounceMs?: number;
  onSaveError?: () => void;
  onSaveSuccess?: () => void;
};

export class LayoutSaveQueue {
  private readonly debounceMs: number;
  private readonly excludedWidgetIds = new Set<string>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private pendingLayout: DashboardLayoutItem[] | undefined;
  private failedLayout: DashboardLayoutItem[] | undefined;
  private chain: Promise<void> = Promise.resolve();
  private layoutTaskQueued = false;
  private disposed = false;

  constructor(
    private readonly saveLayout: (
      layout: DashboardLayoutItem[],
    ) => Promise<unknown>,
    private readonly options: LayoutSaveQueueOptions = {},
  ) {
    this.debounceMs = options.debounceMs ?? 500;
  }

  enqueue(layout: DashboardLayoutItem[]) {
    if (this.disposed) return;

    this.pendingLayout = this.filterExcluded(layout);
    this.failedLayout = undefined;
    this.schedule();
  }

  retry() {
    if (this.disposed || !this.failedLayout) return;

    this.pendingLayout ??= this.failedLayout;
    this.failedLayout = undefined;
    this.schedule(0);
  }

  runMutation<T>(mutation: () => Promise<T>): Promise<T> {
    this.flushPendingLayout();

    const result = this.chain.then(mutation);
    this.chain = result.then(
      () => undefined,
      () => undefined,
    );

    return result;
  }

  async removeWidget<T>(
    widgetId: string,
    mutation: () => Promise<T>,
  ): Promise<T> {
    this.excludedWidgetIds.add(widgetId);
    this.pendingLayout = this.withoutWidget(this.pendingLayout, widgetId);
    this.failedLayout = this.withoutWidget(this.failedLayout, widgetId);

    try {
      return await this.runMutation(mutation);
    } catch (error) {
      this.excludedWidgetIds.delete(widgetId);
      throw error;
    }
  }

  dispose() {
    this.disposed = true;
    this.cancelPending();
  }

  cancelPending() {
    this.clearTimer();
    this.pendingLayout = undefined;
    this.failedLayout = undefined;
  }

  async whenIdle() {
    let observedChain: Promise<void>;

    do {
      observedChain = this.chain;
      await observedChain;
    } while (observedChain !== this.chain);
  }

  private schedule(delay = this.debounceMs) {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.queuePendingLayout();
    }, delay);
  }

  private flushPendingLayout() {
    this.clearTimer();
    this.queuePendingLayout();
  }

  private queuePendingLayout() {
    if (
      this.disposed ||
      this.layoutTaskQueued ||
      this.pendingLayout === undefined
    ) {
      return;
    }

    this.layoutTaskQueued = true;
    this.chain = this.chain.then(async () => {
      this.layoutTaskQueued = false;
      const layout = this.pendingLayout;
      this.pendingLayout = undefined;

      if (!layout) return;

      try {
        await this.saveLayout(layout);
        this.failedLayout = undefined;
        if (!this.disposed) this.options.onSaveSuccess?.();
      } catch {
        if (!this.pendingLayout) this.failedLayout = layout;
        if (!this.disposed) this.options.onSaveError?.();
      } finally {
        if (this.pendingLayout) this.queuePendingLayout();
      }
    });
  }

  private filterExcluded(layout: DashboardLayoutItem[]) {
    return layout.filter((item) => !this.excludedWidgetIds.has(item.id));
  }

  private withoutWidget(
    layout: DashboardLayoutItem[] | undefined,
    widgetId: string,
  ) {
    return layout?.filter((item) => item.id !== widgetId);
  }

  private clearTimer() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}
