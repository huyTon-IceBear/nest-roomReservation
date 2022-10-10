import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetRoomOnDate, GetRoomOnRange } from './dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async findFreeRoomOnDate(dto: GetRoomOnDate) {
    //Get all room id have reservation on select date
    const busyRoomIds = await this.prisma.reservation.findMany({
      where: {
        bookingDate: new Date(dto.bookingDate),
      },
      select: { roomId: true },
    });
    //Get all room
    const rooms = await this.prisma.room.findMany({});
    const busyRoomIdsArr = busyRoomIds.map((room) => room.roomId);
    //filter empty room by id room & return empty room
    return rooms.filter((room) => {
      if (!busyRoomIdsArr.includes(room.id)) return room;
    });
  }

  async getAllRoomStatusOnRange(dto: GetRoomOnRange) {
    //Get all room id have reservation on select date
    const reservations = await this.prisma.reservation.findMany({
      where: {
        bookingDate: {
          lte: new Date(dto.endDate),
          gte: new Date(dto.startDate),
        },
      },
    });
    //Get all room
    const rooms = await this.prisma.room.findMany({});
    const roomStatus = rooms.map((room) => {
      let reservationList = [];
      reservations.map((reservation) => {
        if (reservation.roomId !== room.id) {
          room['status'] = 'free';
        } else {
          room['status'] = 'busy';
          reservationList = [...reservationList, reservation];
        }
      });
      room['reservations'] = reservationList;
      return room;
    });
    return roomStatus;
  }
}
