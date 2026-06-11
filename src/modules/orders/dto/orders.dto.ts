import { IsString, IsEnum, IsOptional, IsNumberString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  listingId: string;

  @IsEnum(['ONLINE', 'CASH'])
  paymentMethod: 'ONLINE' | 'CASH';

  @IsOptional()
  @IsNumberString()
  amount?: string; // belirtilmezse ilan fiyatı kullanılır
}

export class ConfirmCashPaymentDto {
  @IsOptional()
  @IsString()
  meetingNote?: string; // buluşma yeri/zamanı notu
}

export class ConfirmHandoffDto {
  @IsOptional()
  @IsString()
  meetingNote?: string;
}
