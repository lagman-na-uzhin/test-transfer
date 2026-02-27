// src/infrastructure/repositories/appeal.prisma-repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAppealRepository } from '@domain/appeal/repositories/appeal.repository';
import { Appeal, AppealChild, AppealStatus } from '@domain/appeal/entities/appeal.entity';

@Injectable()
export class AppealPrismaRepository implements IAppealRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Appeal | null> {
    const row = await this.prisma.appeal.findUnique({
      where: { id },
      include: { children: true },
    });
    if (!row) return null;

    return new Appeal({
      id: row.id,
      category: row.category,
      status: row.status as AppealStatus,
      message: row.message,
      children: row.children.map(
        (c) =>
          new AppealChild({
            id: c.id,
            appealId: c.appealId,
            childIin: c.childIin,
            childName: c.childName,
          }),
      ),
    });
  }

  async save(appeal: Appeal): Promise<void> {
    await this.prisma.appeal.update({
      where: { id: appeal.id },
      data: { status: appeal.status },
    });
  }
}
