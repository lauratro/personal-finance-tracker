import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { NetWorthCategory } from '@prisma/client';

export class CreateNetWorthItemDto {
  @IsString()
  name!: string;

  @IsEnum(NetWorthCategory)
  category!: NetWorthCategory;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  value!: number;
}

export class CreateNetWorthDto {
  @IsDateString()
  monthStart!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateNetWorthItemDto)
  items!: CreateNetWorthItemDto[];
}
