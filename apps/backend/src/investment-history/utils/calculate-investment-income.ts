import { Prisma } from '@prisma/client';

type InvestmentIncome = {
  income: Prisma.Decimal;
  percentageIncome: Prisma.Decimal | null;
};

export function calculateInvestmentIncome(
  quantity: Prisma.Decimal,
  salePrice: Prisma.Decimal,
  totalAmountInvested: Prisma.Decimal,
  taxes?: Prisma.Decimal | null,
): InvestmentIncome {
  const grossIncome = quantity.mul(salePrice).sub(totalAmountInvested);
  const income = grossIncome.sub(taxes ?? new Prisma.Decimal(0));
  const percentageIncome = totalAmountInvested.isZero()
    ? null
    : income.div(totalAmountInvested).mul(100);

  return { income, percentageIncome };
}
