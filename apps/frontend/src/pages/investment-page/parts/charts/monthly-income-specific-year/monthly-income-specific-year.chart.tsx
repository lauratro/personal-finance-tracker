import { getInvestmentIncomeAnalytics } from "@/pages-apis/investment-history"
import { MonthlyIncomes } from "@/pages-apis/investment-history/investment-history-types"
import { useState, useEffect} from "react"
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts"
import { StyledLineChart } from "../realized-income-by-year/realized-income-by-year.style"
import { YearFilter } from "./parts/year-filter"

export const MonthlyIncomeSpecificYearChart = () => {
  const [monthlyIncomesArray, setMonthlyIncomeArray] = useState<MonthlyIncomes>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  useEffect(()  => { 
     const fetchAnalytics = async () => {
     const data = await getInvestmentIncomeAnalytics(selectedYear) 

     setMonthlyIncomeArray(data.monthlyIncome)
    }
    fetchAnalytics()

  }, [selectedYear])

const monthFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
});

const chartData = monthlyIncomesArray.map(({ month, income }) => ({
  month: monthFormatter.format(new Date(2026, month - 1, 1)),
  income,
}));

  return <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Realized income by month</h3>
      </div>
      <div className="mx-4 mt-4 mb-10">
       <YearFilter setSelectedYear={setSelectedYear}/>
       </div>
    <div className="h-[350px] mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <StyledLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
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
}