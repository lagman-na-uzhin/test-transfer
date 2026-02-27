import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ISportsCenterRepository } from '@domain/sports-center/repositories/sports-center.repository';
import { SportsCenterProgram } from '@domain/sports-center/entities/sports-center-program.entity';

@Injectable()
export class SportsCenterPrismaRepository implements ISportsCenterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.sportsCenter.count({ where: { id } });
    return count > 0;
  }

  async findAvailableProgram(
    sportsCenterId: string,
    sportType: string,
  ): Promise<SportsCenterProgram | null> {
    const row = await this.prisma.sportsCenterProgram.findFirst({
      where: { sportsCenterId, sportType },
      include: {
        enrollments: {
          where: { status: { in: ['APPROVED', 'PENDING'] } },
          select: { id: true },
        },
      },
    });

    if (!row) return null;

    const enrollmentCount = row.enrollments.length;
    if (enrollmentCount >= row.capacity) return null;

    return new SportsCenterProgram({
      id: row.id,
      sportsCenterId: row.sportsCenterId,
      sportType: row.sportType,
      capacity: row.capacity,
      enrollmentCount,
    });
  }
}
