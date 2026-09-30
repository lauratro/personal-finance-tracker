type DashboardWidgetSkeletonProps = {
  label: string;
};

export const DashboardWidgetSkeleton = ({
  label,
}: DashboardWidgetSkeletonProps) => (
  <div
    className="h-full min-h-48 animate-pulse rounded-xl bg-gray-50 p-4"
    role="status"
    aria-label={`Loading ${label}`}
  >
    <div className="mb-6 h-5 w-2/5 rounded bg-gray-200" />
    <div className="flex h-36 items-end gap-3 border-b border-gray-200 px-3">
      <div className="h-1/3 flex-1 rounded-t bg-gray-200" />
      <div className="h-2/3 flex-1 rounded-t bg-gray-200" />
      <div className="h-1/2 flex-1 rounded-t bg-gray-200" />
      <div className="h-5/6 flex-1 rounded-t bg-gray-200" />
      <div className="h-3/5 flex-1 rounded-t bg-gray-200" />
    </div>
  </div>
);

export const DashboardGridSkeleton = () => (
  <div
    className="grid grid-cols-1 gap-4 lg:grid-cols-2"
    role="status"
    aria-label="Loading dashboard"
  >
    {[0, 1, 2].map((placeholder) => (
      <div
        key={placeholder}
        className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
      >
        <div className="mb-6 h-5 w-2/5 rounded bg-gray-200" />
        <div className="flex h-56 items-end gap-3 px-3">
          <div className="h-1/3 flex-1 rounded-t bg-gray-100" />
          <div className="h-2/3 flex-1 rounded-t bg-gray-100" />
          <div className="h-1/2 flex-1 rounded-t bg-gray-100" />
          <div className="h-5/6 flex-1 rounded-t bg-gray-100" />
          <div className="h-3/5 flex-1 rounded-t bg-gray-100" />
        </div>
      </div>
    ))}
  </div>
);
