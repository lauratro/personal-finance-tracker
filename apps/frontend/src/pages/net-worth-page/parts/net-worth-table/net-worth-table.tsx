import { useEffect, useMemo, useState } from 'react';
import { getNetWorthSnapshots } from '../../../../pages-apis/net-worth';
import { NetWorthSnapshot } from '@/pages-apis/net-worth/net-worth.types';
import { NetWorthItemEditor } from '../net-worth-item-editor';

const formatMonth = (date: string) =>
  new Date(date).toLocaleDateString('it-IT', {
    month: 'short',
    year: 'numeric',
  });

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

type NetWorthTableProps = {
  refreshKey?: number;
};

export const NetWorthTable = ({ refreshKey = 0 }: NetWorthTableProps) => {
  const [snapshots, setSnapshots] = useState<NetWorthSnapshot[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchSnapshots = async () => {
    try {
      setLoading(true);
      const data = await getNetWorthSnapshots();
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

  const itemNames = useMemo(() => {
    const names = new Set<string>();

    snapshots.forEach((snapshot) => {
      snapshot.items.forEach((item) => {
        names.add(item.name);
      });
    });

    return Array.from(names).sort();
  }, [snapshots]);

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
        <div className="p-10 m-10 bg-red-500 text-white">
  TEST TAILWIND
</div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-6 text-left">Item</th>

              {snapshots.map((snapshot) => (
                <th key={snapshot.id} className="border p-2 text-right">
                  {formatMonth(snapshot.monthStart)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {itemNames.map((itemName) => (
              <tr key={itemName} className="hover:bg-gray-50">
                <td className="border font-medium">{itemName}</td>

                {snapshots.map((snapshot) => {
                  const item = snapshot.items.find(
                    (snapshotItem) => snapshotItem.name === itemName,
                  );

                  return (
                    <td key={snapshot.id} className="border text-right ">
                      <span>{item ? formatCurrency(Number(item.value)) : '-'}</span>
                      <span className="mx-3">
                      <NetWorthItemEditor snapshotId={snapshot.id} itemId={item?.id} editorMode="edit" />
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}

            <tr>
              <td className="border p-2 font-medium">Add item</td>
              {snapshots.map((snapshot) => (
                <td key={snapshot.id} className="border p-2 text-center">
                  <NetWorthItemEditor
                    snapshotId={snapshot.id}
                    onSaved={() => void fetchSnapshots()}
                  />
                </td>
              ))}
            </tr>

            <tr className="bg-gray-100 font-semibold">
              <td className="border p-2">Total</td>

              {snapshots.map((snapshot) => {
                const total = snapshot.items.reduce(
                  (sum, item) => sum + Number(item.value),
                  0,
                );

                return (
                  <td key={snapshot.id} className="border p-2 text-right">
                    {formatCurrency(total)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
