import { IsString, Matches } from 'class-validator';

export class VerifyTwoFactorDto {
  @IsString()
  twoFactorToken!: string;

  @IsString()
  @Matches(/^(?:\d{6}|[A-Z2-9]{5}-?[A-Z2-9]{5})$/i, {
    message: 'code must be a six-digit code or a valid recovery code',
  })
  code!: string;
}
