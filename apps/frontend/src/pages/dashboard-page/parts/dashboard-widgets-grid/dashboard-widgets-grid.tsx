import { useCallback, useEffect, useRef, useState } from 'react';
import ReactGridLayout, {
  useContainerWidth,
  type Layout,
} from 'react-grid-layout';
import {
  createDashboardWidget,
  deleteDashboardWidget,
  getDashboardWidgets,
  updateDashboardLayout,
} from '@/pages-apis/dashboard';
import type {
  DashboardLayoutItem,
  DashboardWidgetItem,
} from '@/pages-apis/dashboard/dashboard-types';
import { DashboardWidget } from '../dashboard-widgets/dashboard-widget';
import { DashboardWidgetType } from '../dashboard-widgets/dashboard-widget.registry';
import { AddWidgetSelector } from './parts/add-widget-selector';
import { LayoutSaveQueue } from './layout-save-queue';

type DashboardError = {
  operation: 'load' | 'add' | 'delete' | 'save';
  message: string;
  retry: () => void;
};

const toLayoutPayload = (layout: Layout): DashboardLayoutItem[] =>
  layout.map((item) => ({
    id: item.i,
    x: item.x,
    y: item.y,
    width: item.w,
    height: item.h,
  }));

export const DashboardWidgetsGrid = () => {
  const { width, containerRef, mounted } = useContainerWidth();
  const [userWidgets, setUserWidgets] = useState<DashboardWidgetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<DashboardError>();
  const saveQueueRef = useRef<LayoutSaveQueue | null>(null);
  const isActiveRef = useRef(true);

  if (!saveQueueRef.current) {
    saveQueueRef.current = new LayoutSaveQueue(updateDashboardLayout, {
      onSaveError: () => {
        if (!isActiveRef.current) return;
        setError({
          operation: 'save',
          message: "Dashboard layout couldn't be saved.",
          retry: () => saveQueueRef.current?.retry(),
        });
      },
      onSaveSuccess: () => {
        if (!isActiveRef.current) return;
        setError((current) =>
          current?.operation === 'save' ? undefined : current,
        );
      },
    });
  }

  const loadWidgets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError((current) =>
        current?.operation === 'load' ? undefined : current,
      );
      const widgets = await getDashboardWidgets();
      setUserWidgets(widgets ?? []);
    } catch {
      setError({
        operation: 'load',
        message: "Dashboard widgets couldn't be loaded.",
        retry: () => void loadWidgets(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isActiveRef.current = true;
    void loadWidgets();

    return () => {
      isActiveRef.current = false;
      saveQueueRef.current?.cancelPending();
    };
  }, [loadWidgets]);

  const addWidget = async (type: DashboardWidgetType) => {
    try {
      const createdWidget = await saveQueueRef.current!.runMutation(() =>
        createDashboardWidget({
          type,
          x: 0,
          y: 0,
          width: 6,
          height: 5,
          minWidth: 4,
          minHeight: 4,
          maxWidth: 12,
          maxHeight: 10,
        }),
      );

      setUserWidgets((current) => [...current, createdWidget]);
      setError((current) =>
        current?.operation === 'add' ? undefined : current,
      );
    } catch {
      setError({
        operation: 'add',
        message: "The widget couldn't be added.",
        retry: () => void addWidget(type),
      });
    }
  };

  const removeWidget = async (id: string) => {
    try {
      await saveQueueRef.current!.removeWidget(id, () =>
        deleteDashboardWidget(id),
      );
      setUserWidgets((current) =>
        current.filter((widget) => widget.id !== id),
      );
      setError((current) =>
        current?.operation === 'delete' ? undefined : current,
      );
    } catch {
      setError({
        operation: 'delete',
        message: "The widget couldn't be deleted.",
        retry: () => void removeWidget(id),
      });
    }
  };

  const queueLayoutSave = (newLayout: Layout) => {
    saveQueueRef.current?.enqueue(toLayoutPayload(newLayout));
  };

  const layout = userWidgets.map((widget) => ({
    i: widget.id,
    x: widget.x,
    y: widget.y,
    w: widget.width,
    h: widget.height,
    minW: widget.minWidth,
    maxW: widget.maxWidth,
    minH: widget.minHeight,
    maxH: widget.maxHeight,
  }));

  if (isLoading) return <div>Loading dashboard widgets...</div>;

  return (
    <div>
      {error ? (
        <div className="form-error my-4" role="alert">
          <span>{error.message}</span>{' '}
          <button type="button" onClick={error.retry}>
            Retry
          </button>
        </div>
      ) : null}

      <div className="my-4">
        <AddWidgetSelector onAdd={addWidget} />
      </div>

      <div ref={containerRef}>
        {mounted && (
          <ReactGridLayout
            width={width}
            layout={layout}
            gridConfig={{
              cols: 12,
              rowHeight: 120,
              margin: [10, 10],
              containerPadding: [0, 0],
            }}
            dragConfig={{
              enabled: true,
              handle: '.dashboard-drag-handle',
            }}
            resizeConfig={{ enabled: true }}
            onDragStop={queueLayoutSave}
            onResizeStop={queueLayoutSave}
            onLayoutChange={(newLayout) => {
              setUserWidgets((current) =>
                current.map((widget) => {
                  const item = newLayout.find(
                    (layoutItem) => layoutItem.i === widget.id,
                  );

                  return item
                    ? {
                        ...widget,
                        x: item.x,
                        y: item.y,
                        width: item.w,
                        height: item.h,
                      }
                    : widget;
                }),
              );
            }}
          >
            {userWidgets.map((widget) => (
              <div key={widget.id}>
                <DashboardWidget
                  widgetId={widget.id}
                  type={widget.type}
                  onRemove={removeWidget}
                />
              </div>
            ))}
          </ReactGridLayout>
        )}
      </div>
    </div>
  );
};
