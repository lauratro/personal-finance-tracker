import { useEffect, useMemo, useState } from 'react';
import { getNetWorthSnapshotsBasedOnYear } from '../../../../pages-apis/net-worth';
import { NetWorthSnapshot } from '@/pages-apis/net-worth/net-worth.types';
import { NetWorthItemEditor } from '../net-worth-item-editor';
import { NetWorthItemDeleteButton } from '../net-worth-item-delete-button/net-worth-item-delete-button';
import { NetWorthDeleteButton } from '../net-worth-delete-button/net-worth-delete-button';
import { NetWorthDisplayerProps } from './net-worth-displayer.types';

const formatMonth = (date: string) =>
  new Date(date).toLocaleDateString('de-DE', {
    month: 'short',
    year: 'numeric',
  });

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

export const NetWorthDisplayer = ({ refreshKey = 0, year }: NetWorthDisplayerProps) => {
  const [snapshots, setSnapshots] = useState<NetWorthSnapshot[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchSnapshots = async () => {
    try {
      setLoading(true);
      const data = await getNetWorthSnapshotsBasedOnYear(year);
       console.log('Fetched net worth snapshots:', data);
      const sortedSnapshots = [...data].sort(
        (a, b) =>
          new Date(a.monthStart).getTime() - new Date(b.monthStart).getTime(),
      );

      setSnapshots(sortedSnapshots);
    } catch (error) {
      console.error('Error fetching net worth snapshots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSnapshots();
  }, [refreshKey]);


const totals = useMemo(
  () =>
    snapshots.map((snapshot) => ({
      snapshot,
      total: snapshot.items.reduce(
        (sum, item) => sum + Number(item.value),
        0,
      ),
    })),
  [snapshots],
);

  if (isLoading) {
    return <p>Loading...</p>;
  }
 
  if (snapshots.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No net worth snapshots yet.
      </p>
    );
  }

  return (
  <div className="p-4">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {totals.map(({ snapshot, total }, index) => {
        const previousTotal = index > 0 ? totals[index - 1].total : null;
        const variation =
          previousTotal !== null ? total - previousTotal : null;

        return (
          <div
            key={snapshot.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {formatMonth(snapshot.monthStart)}
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatCurrency(total)}
                </p>

                <p
                  className={`mt-1 text-sm ${
                    variation === null
                      ? 'text-gray-400'
                      : variation > 0
                        ? 'text-green-600'
                        : variation < 0
                          ? 'text-red-600'
                          : 'text-gray-500'
                  }`}
                >
                  {variation === null
                    ? 'First snapshot'
                    : `${variation > 0 ? '+' : ''}${formatCurrency(variation)} vs previous month`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <NetWorthItemEditor
                  snapshotId={snapshot.id}
                  onSaved={() => void fetchSnapshots()}
                />

                <NetWorthDeleteButton
                  snapshotId={snapshot.id}
                  onDeleted={() => void fetchSnapshots()}
                />
              </div>
            </div>

            <div className="space-y-3">
              {snapshot.items.length === 0 ? (
                <p className="text-sm text-gray-400">No items yet.</p>
              ) : (
                snapshot.items.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2 hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {formatCurrency(Number(item.value))}
                      </span>

                      <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                        <NetWorthItemEditor
                          snapshotId={snapshot.id}
                          itemId={item.id}
                          editorMode="edit"
                          onSaved={() => void fetchSnapshots()}
                        />

                        <NetWorthItemDeleteButton
                          snapshotId={snapshot.id}
                          itemId={item.id}
                          onDeleted={() => void fetchSnapshots()}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)
}