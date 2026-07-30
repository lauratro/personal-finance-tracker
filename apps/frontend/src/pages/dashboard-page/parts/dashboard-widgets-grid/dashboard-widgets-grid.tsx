import { useState } from 'react';
import ReactGridLayout, {
  useContainerWidth,
  type Layout,
} from 'react-grid-layout';
import { DashboardWidget } from '../dashboard-widgets/dashboard-widget';
import { DashboardWidgetType } from '../dashboard-widgets/dashboard-widget.registry';
import { useEffect } from 'react';
import { DashboardWidgetItem } from '@/pages-apis/dashboard/dashboard-types';
import { getDashboardWidgets, editDashboardWidget, deleteDashboardWidget, createDashboardWidget } from '@/pages-apis/dashboard';
import { AddWidgetSelector } from './parts/add-widget-selector';

export const DashboardWidgetsGrid = () => {
  const { width, containerRef, mounted } = useContainerWidth();
  const [userWidgets, setUserWidgets] = useState<DashboardWidgetItem[]>([])
 
  useEffect(() => {
    const fetchData = async () => {
        const widgetsList = await getDashboardWidgets()
        setUserWidgets(widgetsList)

    }
   fetchData()
  }, [])

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

    const addWidget = async(type: DashboardWidgetType) => {
  const createdWidget = await createDashboardWidget({
    type,
    x: 0,
    y: 0,
    width: 6,
    height: 5,
    minWidth: 4,
    minHeight: 4,
    maxWidth: 12,
    maxHeight: 10,
  });

  setUserWidgets((currentWidgets) => [
    ...currentWidgets,
    createdWidget,
  ]);
};

   const removeWidget = async(id: string) => {
     const removed = await deleteDashboardWidget(id)

     setUserWidgets((currentWidgets) => {
       return currentWidgets.filter(w => w.id !== removed.id)
     })
   }
    

const saveLayout = async (newLayout: Layout) => {
  await Promise.all(
    newLayout.map((item) =>
      editDashboardWidget(item.i, {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      }),
    ),
  );
};

return (
    <div>
        <div className='my-4'>
         <AddWidgetSelector onAdd={addWidget}/> </div>
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
              onDragStop={saveLayout}
               onResizeStop={saveLayout}
             onLayoutChange={(newLayout) => {
              setUserWidgets((current) =>
                 current.map((widget) => {
                   const item = newLayout.find(
                (l) => l.i === widget.id,
               );

      if (!item) {
        return widget;
      }

      return {
        ...widget,
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };
    }),
  );
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
)

}