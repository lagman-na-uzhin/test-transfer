import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IEnrollmentRepository } from '@domain/enrollment/repositories/enrollment.repository';
import { Enrollment, EnrollmentStatus } from '@domain/enrollment/entities/enrollment.entity';

@Injectable()
export class EnrollmentPrismaRepository implements IEnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findApprovedByAthleteAndCenter(
    athleteProfileId: string,
    sportsCenterId: string,
  ): Promise<Enrollment | null> {
    const row = await this.prisma.enrollment.findFirst({
      where: {
        athleteProfileId,
        sportsCenterId,
        status: 'APPROVED',
      },
    });
    if (!row) return null;

    return new Enrollment({
      id: row.id,
      athleteProfileId: row.athleteProfileId,
      sportsCenterId: row.sportsCenterId,
      programId: row.programId,
      status: row.status as EnrollmentStatus,
    });
  }

  async save(enrollment: Enrollment): Promise<void> {
    await this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        sportsCenterId: enrollment.sportsCenterId,
        programId: enrollment.programId,
        status: enrollment.status,
      },
    });
  }
}
