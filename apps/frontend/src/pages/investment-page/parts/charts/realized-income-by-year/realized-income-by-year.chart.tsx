import { useEffect, useState } from "react";
import { getInvestmentIncomeAnalytics } from "@/pages-apis/investment-history";
import {
  YearlyIncomes,
} from "../../../../../pages-apis/investment-history/investment-history-types"

export const RealizedIncomeByYearChart = () => {
  const [allYearsArray, setAllYearsArray] = useState<YearlyIncomes | []>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await getInvestmentIncomeAnalytics();

      setAllYearsArray(data.yearlyIncome);
    };

    fetchAnalytics();
  }, []);

  console.log("allYears", allYearsArray)
  return <div></div>;
};