import { useEffect, useMemo, useState } from 'react';
import { getNetWorthSnapshots } from '../../../../pages-apis/net-worth';
import { NetWorthSnapshot } from '@/pages-apis/net-worth/net-worth.types';
import { NetWorthItemEditor } from '../net-worth-item-editor';
import { NetWorthItemDeleteButton } from '../net-worth-item-delete-button/net-worth-item-delete-button';

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

  const totals = snapshots.map((snapshot) =>
  snapshot.items.reduce(
    (sum, item) => sum + Number(item.value),
    0
  )
);

  return (
    <div className="p-4">
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
                <td className="border p-2 font-medium">{itemName}</td>

                {snapshots.map((snapshot) => {
                  const item = snapshot.items.find(
                    (snapshotItem) => snapshotItem.name === itemName,
                  );

                  return (
                    <td key={snapshot.id} className="border text-right">
                        <div className="flex items-center justify-end gap-2">
                      <span>{item ? formatCurrency(Number(item.value)) : '-'}</span>
                      <span className="mx-3 flex items-center justify-end gap-2">
                      {item?.id ? (
                        <span className="flex items-center justify-end gap-2">
                          <NetWorthItemEditor snapshotId={snapshot.id} itemId={item.id} editorMode="edit" />
                          <NetWorthItemDeleteButton snapshotId={snapshot.id} itemId={item.id} />
                        </span>
                      ):    
                      <NetWorthItemEditor snapshotId={snapshot.id} editorMode="create" />}
                      </span>
                         </div>
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

          {totals.map((total, index) => (
             <td key={snapshots[index].id} className="border p-2 text-right">
      {formatCurrency(total)}
               </td>
           ))}
     </tr>
     <tr className="bg-gray-50">
          <td className="border p-2 font-medium">Variation</td>

             {totals.map((total, index) => {
                   if (index === 0) {
                return (
                     <td key={snapshots[index].id} className="border p-2 text-right">
                      -
                    </td>
                    );
                 }

            const variation = total - totals[index - 1];

           return (
                     <td
                     key={snapshots[index].id}
                     className={`border p-2 text-right ${
                     variation > 0
                      ? 'text-green-600'
                          : variation < 0
                          ? 'text-red-600'
                          : ''
                            }`}
                           >
        {variation > 0 ? '+' : ''}
        {formatCurrency(variation)}
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
