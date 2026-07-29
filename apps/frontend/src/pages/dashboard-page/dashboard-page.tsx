import { useState } from 'react';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import ReactGridLayout, {
  useContainerWidth,
  type Layout,
} from 'react-grid-layout';

import { useAuth } from '@/pages-apis/auth/auth-context';
import { DashboardWidget } from './parts/dashboard-widgets/dashboard-widget';
import {
  DashboardWidget as DashboardWidgetData,
} from './dashboard.types';
import { DashboardWidgetType } from './parts/dashboard-widgets/dashboard-widget.registry';
import { PageContainer } from '@/containers/page-container';

export const DashboardPage = () => {
  const { user } = useAuth();

  const { width, containerRef, mounted } = useContainerWidth();

  const [widgets, setWidgets] = useState<DashboardWidgetData[]>([
    {
      id: 'yearly-income',
      type: 'yearlyIncome',
    },
    {
      id: 'monthly-income',
      type: 'monthlyIncome',
    },
  ]);

  const [layout, setLayout] = useState<Layout>([
    {
      i: 'yearly-income',
      x: 0,
      y: 0,
      w: 6,
      h: 5,
      minW: 4,
      minH: 4,
      maxW: 12,
      maxH: 10,
    },
    {
      i: 'monthly-income',
      x: 6,
      y: 0,
      w: 6,
      h: 5,
      minW: 4,
      minH: 4,
      maxW: 12,
      maxH: 10,
    },
  ]);

  const addWidget = () => {
    const id = crypto.randomUUID();

    setWidgets((currentWidgets) => [
      ...currentWidgets,
      {
        id,
      },
    ]);

    setLayout((currentLayout) => [
      ...currentLayout,
      {
        i: id,
        x: 0,
        y: Infinity,
        w: 6,
        h: 5,
      },
    ]);
  };

  const selectWidget = (
    widgetId: string,
    type: DashboardWidgetType,
  ) => {
    setWidgets((currentWidgets) =>
      currentWidgets.map((widget) =>
        widget.id === widgetId
          ? {
              ...widget,
              type,
            }
          : widget,
      ),
    );
  };

  const removeWidget = (widgetId: string) => {
    setWidgets((currentWidgets) =>
      currentWidgets.filter((widget) => widget.id !== widgetId),
    );

    setLayout((currentLayout) =>
      currentLayout.filter(
        (layoutItem) => layoutItem.i !== widgetId,
      ),
    );
  };

  return (
    <PageContainer
      title="Dashboard"
      description="Welcome to your personal finance dashboard!"
    >
      <div className="px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome back, {user?.firstName ?? 'Investor'}
            </h1>

            <p className="mt-1 text-gray-500">
              Here is an overview of your investments.
            </p>
          </div>

          <Button
            leftSection={<IconPlus size={18} />}
            onClick={addWidget}
          >
            Add widget
          </Button>
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
              resizeConfig={{
                enabled: true,
              }}
              onLayoutChange={(newLayout) => {
                setLayout([...newLayout]);
              }}
   /*              onResizeStop={(newLayout) => {
                  const updatedLayout = [...newLayout];

                   setLayout(updatedLayout);

                    saveDashboardConfiguration({
                     widgets,
                     layout: updatedLayout,
                      });
  }} */
            >
              {widgets.map((widget) => (
                <div key={widget.id}>
                  <DashboardWidget
                    widgetId={widget.id}
                    type={widget.type}
                    onSelect={selectWidget}
                    onRemove={removeWidget}
                  />
                </div>
              ))}
            </ReactGridLayout>
          )}
        </div>
      </div>
    </PageContainer>
  );
};