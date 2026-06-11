import { IsString, IsNumber, IsPositive, IsOptional, MaxLength } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  listingId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  message?: string;
}

export class RespondOfferDto {
  @IsString()
  action: 'ACCEPTED' | 'REJECTED';
}
