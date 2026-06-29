import {
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer/types/decorators/type.decorator';
import { NetWorthCategory } from '@prisma/client';


export class UpdateNetWorthDto {    
  @IsDateString()
  monthStart?: string;
}


export class UpdateNetWorthItemDto {
  @IsString()
    name!: string;
  
    @IsEnum(NetWorthCategory)
    category!: NetWorthCategory;
  
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    value!: number;
}