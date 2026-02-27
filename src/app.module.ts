import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { AppealPrismaRepository } from './infrastructure/repositories/appeal.prisma-repository';
import { EnrollmentPrismaRepository } from './infrastructure/repositories/enrollment.prisma-repository';
import { SportsCenterPrismaRepository } from './infrastructure/repositories/sports-center.prisma-repository';
import { AthleteProfilePrismaRepository } from './infrastructure/repositories/athlete-profile.prisma-repository';

// Domain tokens
import { APPEAL_REPOSITORY } from './domain/appeal/repositories/appeal.repository';
import { ENROLLMENT_REPOSITORY } from './domain/enrollment/repositories/enrollment.repository';
import { SPORTS_CENTER_REPOSITORY } from './domain/sports-center/repositories/sports-center.repository';
import { ATHLETE_PROFILE_REPOSITORY } from './domain/athlete-profile/repositories/athlete-profile.repository';

// Application
import { TransferChildHandler } from './application/commands/transfer-child/transfer-child.handler';

// Presentation
import { AppealsController } from './presentation/controllers/appeals.controller';

@Module({
  imports: [CqrsModule],
  controllers: [AppealsController],
  providers: [
    PrismaService,

    { provide: APPEAL_REPOSITORY, useClass: AppealPrismaRepository },
    { provide: ENROLLMENT_REPOSITORY, useClass: EnrollmentPrismaRepository },
    { provide: SPORTS_CENTER_REPOSITORY, useClass: SportsCenterPrismaRepository },
    { provide: ATHLETE_PROFILE_REPOSITORY, useClass: AthleteProfilePrismaRepository },

    TransferChildHandler,
  ],
})
export class AppModule {}
