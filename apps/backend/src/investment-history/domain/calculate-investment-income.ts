import { Prisma } from '@prisma/client';

type InvestmentIncome = {
  income: Prisma.Decimal;
  percentageIncome: Prisma.Decimal | null;
};

export function calculateInvestmentIncome(
  quantity: Prisma.Decimal,
  salePrice: Prisma.Decimal,
  totalAmountInvested: Prisma.Decimal,
): InvestmentIncome {
  const income = quantity.mul(salePrice).sub(totalAmountInvested);
  const percentageIncome = totalAmountInvested.isZero()
    ? null
    : income.div(totalAmountInvested).mul(100);

  return { income, percentageIncome };
}
