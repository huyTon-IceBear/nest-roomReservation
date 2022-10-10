import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  // @IsDateString()
  @IsOptional()
  bookingDate: Date;

  @IsString()
  @IsOptional()
  description?: string;
}
