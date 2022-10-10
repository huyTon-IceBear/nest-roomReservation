import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get(':id')
  getReservationById(
    @GetUser('id') userId: number,
    @Query('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.reservationService.getReservationsById(userId, reservationId);
  }

  @Post()
  createReservation(
    @GetUser('id') userId: number,
    @Query('roomId', ParseIntPipe) roomId: number,
    @Body() dto: CreateReservationDto,
  ) {
    return this.reservationService.createReservation(userId, roomId, dto);
  }

  @Patch(':id')
  editReservation(
    @GetUser('id') userId: number,
    @Query('reservationId', ParseIntPipe) reservationId: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.editReservation(
      userId,
      reservationId,
      updateReservationDto,
    );
  }

  @Delete(':id')
  deleteReservationById(
    @GetUser('id') userId: number,
    @Query('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.reservationService.deleteReservationById(userId, reservationId);
  }
}
