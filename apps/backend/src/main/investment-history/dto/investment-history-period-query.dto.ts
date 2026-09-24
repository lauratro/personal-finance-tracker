import {
  IsDateString,
  IsOptional,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

function IsValidDateRange(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isValidDateRange',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(untilDate: unknown, args: ValidationArguments) {
          const { fromDate } = args.object as InvestmentHistoryPeriodQueryDto;

          if (fromDate === undefined || untilDate === undefined) {
            return true;
          }

          const fromTimestamp = Date.parse(fromDate);
          const untilTimestamp = Date.parse(String(untilDate));

          if (
            Number.isNaN(fromTimestamp) ||
            Number.isNaN(untilTimestamp)
          ) {
            return true;
          }

          return fromTimestamp <= untilTimestamp;
        },
      },
    });
  };
}

export class InvestmentHistoryPeriodQueryDto {
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'fromDate must be a valid ISO 8601 date' },
  )
  fromDate?: string;

  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'untilDate must be a valid ISO 8601 date' },
  )
  @IsValidDateRange({
    message: 'fromDate must be earlier than or equal to untilDate',
  })
  untilDate?: string;
}
