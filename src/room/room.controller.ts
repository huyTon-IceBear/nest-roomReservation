import { Controller, Get, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { GetRoomOnDate, GetRoomOnRange } from './dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  getListOfFreeRoomOnDate(@Body() dto: GetRoomOnDate) {
    return this.roomService.findFreeRoomOnDate(dto);
  }

  @Get('range')
  getAllRoomStatusOnRange(@Body() dto: GetRoomOnRange) {
    return this.roomService.getAllRoomStatusOnRange(dto);
  }
}
