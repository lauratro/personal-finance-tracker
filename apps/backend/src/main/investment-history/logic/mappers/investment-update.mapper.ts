import { UpdateInvestmentHistoryDto } from '../../dto/update-investment-history.dto';
import { Investment, Prisma } from '@prisma/client';
import { calculateInvestmentIncome } from '../../utils/calculate-investment-income';

export class InvestmentUpdateMapper {
  static  mapInvestment (investment: Investment, dto: UpdateInvestmentHistoryDto): Prisma.InvestmentUpdateInput {
  
      const updatedData: Prisma.InvestmentUpdateInput = {};
  
      if (dto.name !== undefined) updatedData.name = dto.name;
      if (dto.assetType !== undefined) updatedData.assetType = dto.assetType;
      if (dto.boughtDate !== undefined) updatedData.boughtDate = new Date(dto.boughtDate);
      if (dto.totalAmountInvested !== undefined) {
        updatedData.totalAmountInvested = new Prisma.Decimal(dto.totalAmountInvested);
      }
      if (dto.costSingleStock !== undefined) {
        updatedData.costSingleStock = new Prisma.Decimal(dto.costSingleStock);
      }
      if (dto.quantity !== undefined) {
        updatedData.quantity = new Prisma.Decimal(dto.quantity);
      }
      if (dto.plannedPriceToSell !== undefined) {
        updatedData.plannedPriceToSell = new Prisma.Decimal(dto.plannedPriceToSell);
      }
  
////
const decimal = new Prisma.Decimal(dto.quantity || 0);

console.log(decimal);
console.log(typeof decimal);
console.log(decimal instanceof Prisma.Decimal);

updatedData.quantity = decimal;
/////

      const saleDate =
        dto.saleDate !== undefined
          ? dto.saleDate
            ? new Date(dto.saleDate)
            : null
          : investment.saleDate;
      const salePrice =
        dto.salePrice !== undefined
          ? dto.salePrice !== null
            ? new Prisma.Decimal(dto.salePrice)
            : null
          : investment.salePrice;
      const taxes =
        dto.taxes !== undefined
          ? dto.taxes !== null
            ? new Prisma.Decimal(dto.taxes)
            : null
          : investment.taxes;
  
      if (dto.saleDate !== undefined) updatedData.saleDate = saleDate;
      if (dto.salePrice !== undefined) updatedData.salePrice = salePrice;
      if (dto.taxes !== undefined) updatedData.taxes = taxes;
  
      if (saleDate && salePrice) {
        const quantity =
          dto.quantity !== undefined
            ? new Prisma.Decimal(dto.quantity)
            : investment.quantity;
        const totalAmountInvested =
          dto.totalAmountInvested !== undefined
            ? new Prisma.Decimal(dto.totalAmountInvested)
            : investment.totalAmountInvested;
        const income = calculateInvestmentIncome(
          quantity,
          salePrice,
          totalAmountInvested,
        );
  
        updatedData.income = income.income;
        updatedData.percentageIncome = income.percentageIncome;
      } else {
        updatedData.income = null;
        updatedData.percentageIncome = null;
      }

        return updatedData;
    }
}