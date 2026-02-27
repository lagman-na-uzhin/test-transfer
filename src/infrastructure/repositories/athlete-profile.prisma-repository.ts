import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAthleteProfileRepository } from '@domain/athlete-profile/repositories/athlete-profile.repository';

@Injectable()
export class AthleteProfilePrismaRepository implements IAthleteProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findIdByIin(iin: string): Promise<string | null> {
    const row = await this.prisma.athleteProfile.findUnique({
      where: { iin },
      select: { id: true },
    });
    return row?.id ?? null;
  }
}
