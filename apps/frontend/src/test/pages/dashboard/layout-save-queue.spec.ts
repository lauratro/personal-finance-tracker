import { LayoutSaveQueue } from '@/pages/dashboard-page/parts/dashboard-widgets-grid/layout-save-queue';
import type { DashboardLayoutItem } from '@/pages-apis/dashboard/dashboard-types';

const item = (id: string, x: number): DashboardLayoutItem => ({
  id,
  x,
  y: 0,
  width: 4,
  height: 4,
});

const deferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
};

describe('LayoutSaveQueue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('debounces and coalesces layouts into the latest bulk save', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const queue = new LayoutSaveQueue(save, { debounceMs: 200 });

    queue.enqueue([item('widget-1', 1)]);
    queue.enqueue([item('widget-1', 2)]);
    await vi.advanceTimersByTimeAsync(200);
    await queue.whenIdle();

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith([item('widget-1', 2)]);
  });

  it('serializes saves while retaining only the latest queued layout', async () => {
    const firstSave = deferred();
    const save = vi
      .fn()
      .mockReturnValueOnce(firstSave.promise)
      .mockResolvedValue(undefined);
    const queue = new LayoutSaveQueue(save, { debounceMs: 100 });

    queue.enqueue([item('widget-1', 1)]);
    await vi.advanceTimersByTimeAsync(100);
    queue.enqueue([item('widget-1', 2)]);
    queue.enqueue([item('widget-1', 3)]);
    await vi.advanceTimersByTimeAsync(100);

    expect(save).toHaveBeenCalledTimes(1);
    firstSave.resolve();
    await queue.whenIdle();

    expect(save).toHaveBeenCalledTimes(2);
    expect(save).toHaveBeenLastCalledWith([item('widget-1', 3)]);
  });

  it('removes deleted widgets from pending saves and orders deletion after saves', async () => {
    const events: string[] = [];
    const save = vi.fn(async (layout: DashboardLayoutItem[]) => {
      events.push(`save:${layout.map(({ id }) => id).join(',')}`);
    });
    const queue = new LayoutSaveQueue(save, { debounceMs: 200 });

    queue.enqueue([item('widget-1', 1), item('widget-2', 2)]);
    await queue.removeWidget('widget-2', async () => {
      events.push('delete:widget-2');
    });

    expect(events).toEqual(['save:widget-1', 'delete:widget-2']);
  });

  it('waits for an in-flight save and strips the deleted widget from the next save', async () => {
    const firstSave = deferred();
    const savedLayouts: DashboardLayoutItem[][] = [];
    const save = vi.fn(async (layout: DashboardLayoutItem[]) => {
      savedLayouts.push(layout);
      if (savedLayouts.length === 1) await firstSave.promise;
    });
    const queue = new LayoutSaveQueue(save, { debounceMs: 100 });
    const events: string[] = [];

    queue.enqueue([item('widget-1', 1), item('widget-2', 2)]);
    await vi.advanceTimersByTimeAsync(100);
    queue.enqueue([item('widget-1', 3), item('widget-2', 4)]);
    const deletion = queue.removeWidget('widget-2', async () => {
      events.push('deleted');
    });

    expect(events).toEqual([]);
    firstSave.resolve();
    await deletion;

    expect(savedLayouts).toEqual([
      [item('widget-1', 1), item('widget-2', 2)],
      [item('widget-1', 3)],
    ]);
    expect(events).toEqual(['deleted']);
  });

  it('allows a failed save to be retried', async () => {
    const onSaveError = vi.fn();
    const onSaveSuccess = vi.fn();
    const save = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValue(undefined);
    const queue = new LayoutSaveQueue(save, {
      debounceMs: 100,
      onSaveError,
      onSaveSuccess,
    });

    queue.enqueue([item('widget-1', 1)]);
    await vi.advanceTimersByTimeAsync(100);
    await queue.whenIdle();
    expect(onSaveError).toHaveBeenCalledOnce();

    queue.retry();
    await vi.advanceTimersByTimeAsync(0);
    await queue.whenIdle();

    expect(save).toHaveBeenCalledTimes(2);
    expect(onSaveSuccess).toHaveBeenCalledOnce();
  });
});
