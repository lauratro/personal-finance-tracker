import { Card } from "@mantine/core";
import { TotalIncomeDisplayerProps } from "./total-income-displayer.types";

export const TotalIncomeDisplayer = ({investments}: TotalIncomeDisplayerProps) => {
  const total = investments.reduce(
    (sum, investment) => sum + Number(investment.income),
    0
  );
    return (
        <div className="flex w-full justify-start">
        <Card className="mx-4 border-primary p-4">
            <div><span className="font-bold">Total Income:</span> <span>{total} €</span></div>
        </Card></div>
    )

}