import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3333);

  //Check if the dummy for room is ready
  // If not generate 9 room, 3 rooms for each floor
  const prisma = new PrismaClient();
  const rooms = await prisma.room.findMany({
    where: {},
  });
  if (rooms?.length === 0) {
    await prisma.room.createMany({
      data: [
        { roomNr: '101', floor: 1 },
        { roomNr: '102', floor: 1 },
        { roomNr: '103', floor: 1 },
        { roomNr: '201', floor: 2 },
        { roomNr: '202', floor: 2 },
        { roomNr: '203', floor: 2 },
        { roomNr: '301', floor: 3 },
        { roomNr: '302', floor: 3 },
        { roomNr: '303', floor: 3 },
      ],
    });
  }
}
bootstrap();
