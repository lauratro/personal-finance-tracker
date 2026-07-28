import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { formatMonth } from '@/utils/formatMonts';
import { formatCurrency } from '@/utils/formatCurrency';
import { NetWorthSnapshot, SortDirection } from '@/pages-apis/net-worth/net-worth.types';
import { getNetWorthSnapshots } from '@/pages-apis/net-worth';

export const NetWorthTrendChart = () => {

    const [snapshots, setSnapshots] = useState<NetWorthSnapshot[]>([])
    useEffect( () => {
    const fetchSnaphots = async () => {
        const data = await getNetWorthSnapshots(SortDirection.ASC)
         setSnapshots(data)
    }
    fetchSnaphots()
  }, 
  [])

  const getSnapshotTotal = (snapshot: NetWorthSnapshot) =>
  snapshot.items.reduce((sum, item) => sum + Number(item.value), 0);  

  const data = snapshots.map((snapshot) => ({
    month: formatMonth(snapshot.monthStart),
    total: getSnapshotTotal(snapshot),
  }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Net Worth Trend</h3>
        <p className="text-sm text-gray-500">
          Total net worth over the selected year.
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat('en-EN', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(Number(value))
              }
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value) => [
                formatCurrency(Number(value)),
                'Net Worth',
              ]}
            />

            <Line
              type="monotone"
              dataKey="total"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};