import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { DashboardWidgetType } from '../schema/types/dashboard-widget-type';

export class DashboardWidgetDto {
  @IsInt()
  x!: number;

  @IsInt()
  y!: number;

  @IsInt()
  width!: number;

  @IsInt()
  height!: number;

  @IsOptional()
  configuration?: Record<string, unknown>;
}

export class CreateDashboardWidgetDto extends DashboardWidgetDto {
  @IsEnum(DashboardWidgetType)
  type!: DashboardWidgetType;

  @IsOptional()
  @IsInt()
  minWidth?: number;

  @IsOptional()
  @IsInt()
  minHeight?: number;

  @IsOptional()
  @IsInt()
  maxWidth?: number;

  @IsOptional()
  @IsInt()
  maxHeight?: number;
}
