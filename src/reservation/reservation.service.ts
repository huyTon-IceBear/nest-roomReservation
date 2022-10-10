import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto, UpdateReservationDto } from './dto';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async createReservation(
    userId: number,
    roomId: number,
    dto: CreateReservationDto,
  ) {
    if (!roomId) throw new BadRequestException('Missing params');
    //Find the room by id
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
    //Check if the room exit
    if (!room) throw new NotFoundException('Room does not exist');
    //Get all reservations on that day
    const reservations = await this.prisma.reservation.findMany({
      where: {
        roomId: roomId,
      },
    });
    //Check if the room have any reservations on that day (by checking day and month)
    const bookingDate = new Date(dto.bookingDate);
    const status = reservations.some((reservation) => {
      return (
        reservation.bookingDate.getDate() === bookingDate.getDate() &&
        reservation.bookingDate.getMonth() === bookingDate.getMonth() &&
        reservation.bookingDate.getFullYear() === bookingDate.getFullYear()
      );
    });
    if (status)
      throw new BadRequestException(
        'Room is busy on ' +
          bookingDate.getDate() +
          '/' +
          (bookingDate.getMonth() + 1) +
          '/' +
          bookingDate.getFullYear(),
      );
    //Create reservation
    const reservation = await this.prisma.reservation.create({
      data: {
        userId,
        roomId,
        bookingDate: bookingDate,
        description: dto.description,
      },
    });
    return (
      'Reservation for room ' +
      room.roomNr +
      ' is created on date ' +
      reservation.bookingDate
    );
  }

  async getReservationsById(userId: number, reservationId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
    });
    console.log('reservation', reservation);
    if (!reservation) throw new NotFoundException('Reservation does not exist');
    if (reservation.userId !== userId)
      throw new ForbiddenException('Access to resources denied');
    return reservation;
  }

  async editReservation(
    userId: number,
    reservationId: number,
    dto: UpdateReservationDto,
  ) {
    await this.getReservationsById(userId, reservationId);
    return this.prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteReservationById(userId: number, reservationId: number) {
    await this.getReservationsById(userId, reservationId);
    const reservation = await this.prisma.reservation.delete({
      where: {
        id: reservationId,
      },
    });

    return (
      'Reservation on date ' +
      reservation.bookingDate +
      ' at room ' +
      reservation.roomId +
      ' is canceled.'
    );
  }
}
