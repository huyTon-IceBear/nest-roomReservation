import { IsDateString } from 'class-validator';

export class GetRoomOnDate {
  @IsDateString()
  bookingDate: Date;
}

export class GetRoomOnRange {
  @IsDateString()
  startDate: Date;
  @IsDateString()
  endDate: Date;
}
