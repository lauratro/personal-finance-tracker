import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsPositive,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class DashboardLayoutItemDto {
  @IsUUID()
  id!: string;

  @IsInt()
  @Min(0)
  x!: number;

  @IsInt()
  @Min(0)
  y!: number;

  @IsInt()
  @IsPositive()
  width!: number;

  @IsInt()
  @IsPositive()
  height!: number;
}

export class UpdateDashboardLayoutDto {
  @IsArray()
  @ArrayUnique((item: DashboardLayoutItemDto | null) => item?.id)
  @ValidateNested({ each: true })
  @Type(() => DashboardLayoutItemDto)
  widgets!: DashboardLayoutItemDto[];
}
