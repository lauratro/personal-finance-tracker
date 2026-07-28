import { useEffect, useState } from "react";
import { getInvestmentIncomeAnalytics } from "@/pages-apis/investment-history";
import {
  YearlyIncomes,
} from "../../../../../pages-apis/investment-history/investment-history-types"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StyledLineChart } from "./realized-income-by-year.style";

export const RealizedIncomeByYearChart = () => {
  const [allYearsArray, setAllYearsArray] = useState<YearlyIncomes>([]);
  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await getInvestmentIncomeAnalytics();

      setAllYearsArray(data.yearlyIncome);
    };

    fetchAnalytics();
  }, []);

const chartData = allYearsArray.map(({ year, income }) => ({
  year: year.toString(),
  income: income,
}));
  return   <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Realized income by year</h3>

      </div>


    <div className="h-[350px]">

    <ResponsiveContainer width="100%" height="100%">
      <StyledLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
  
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={12}

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
                  Number(value),
                  'Income',
                ]}
              />
  
              <Line
                type="monotone"
                dataKey="income"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </StyledLineChart>
        </ResponsiveContainer>
      </div>
</div>
};