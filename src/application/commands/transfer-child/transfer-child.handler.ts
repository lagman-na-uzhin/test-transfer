// src/application/commands/transfer-child/transfer-child.handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';

import { TransferChildCommand } from './transfer-child.command';
import { TransferChildResult, ChildTransferResult } from './transfer-child.result';

import { APPEAL_REPOSITORY, IAppealRepository } from '@domain/appeal/repositories/appeal.repository';
import { ENROLLMENT_REPOSITORY, IEnrollmentRepository } from '@domain/enrollment/repositories/enrollment.repository';
import { SPORTS_CENTER_REPOSITORY, ISportsCenterRepository } from '@domain/sports-center/repositories/sports-center.repository';
import { ATHLETE_PROFILE_REPOSITORY, IAthleteProfileRepository } from '@domain/athlete-profile/repositories/athlete-profile.repository';
import { AppealChild } from '@domain/appeal/entities/appeal.entity';
import { SportsCenterProgram } from '@domain/sports-center/entities/sports-center-program.entity';

@CommandHandler(TransferChildCommand)
export class TransferChildHandler implements ICommandHandler<TransferChildCommand, TransferChildResult> {
  constructor(
    @Inject(APPEAL_REPOSITORY) private readonly appealRepo: IAppealRepository,
    @Inject(ENROLLMENT_REPOSITORY) private readonly enrollmentRepo: IEnrollmentRepository,
    @Inject(SPORTS_CENTER_REPOSITORY) private readonly sportsCenterRepo: ISportsCenterRepository,
    @Inject(ATHLETE_PROFILE_REPOSITORY) private readonly athleteProfileRepo: IAthleteProfileRepository,
  ) {}

  async execute(command: TransferChildCommand): Promise<TransferChildResult> {
    const appeal = await this.appealRepo.findById(command.appealId);
    if (!appeal) {
      throw new NotFoundException(`Appeal ${command.appealId} not found`);
    }
    if (!appeal.isChangeProvider()) {
      throw new BadRequestException(`Appeal category must be CHANGE_PROVIDER`);
    }

    const block = appeal.parseTransferBlock();

    const [currentExists, desiredExists] = await Promise.all([
      this.sportsCenterRepo.existsById(block.currentProviderId),
      this.sportsCenterRepo.existsById(block.desiredProviderId),
    ]);
    if (!currentExists) {
      throw new NotFoundException(`Current sports center ${block.currentProviderId} not found`);
    }
    if (!desiredExists) {
      throw new NotFoundException(`Desired sports center ${block.desiredProviderId} not found`);
    }

    const targetProgram = await this.sportsCenterRepo.findAvailableProgram(
      block.desiredProviderId,
      block.desiredSportType,
    );
    if (!targetProgram) {
      throw new NotFoundException(
        `No available program for sport "${block.desiredSportType}" at center ${block.desiredProviderId}`,
      );
    }

    const results: ChildTransferResult[] = await Promise.all(
      appeal.children.map((child) =>
        this.transferSingleChild(child, block.currentProviderId, targetProgram),
      ),
    );

    const allTransferred = results.every((r) => r.success);

    if (allTransferred) {
      appeal.resolve();
      await this.appealRepo.save(appeal);
    }

    return {
      success: results.some((r) => r.success),
      allTransferred,
      results,
    };
  }

  private async transferSingleChild(
    child: AppealChild,
    currentCenterId: string,
    targetProgram: SportsCenterProgram,
  ): Promise<ChildTransferResult> {
    try {
      const athleteProfileId = await this.athleteProfileRepo.findIdByIin(child.childIin);
      if (!athleteProfileId) {
        return this.failResult(child, `Athlete profile not found for IIN ${child.childIin}`);
      }

      const enrollment = await this.enrollmentRepo.findApprovedByAthleteAndCenter(
        athleteProfileId,
        currentCenterId,
      );
      if (!enrollment) {
        return this.failResult(child, `No APPROVED enrollment found at current center`);
      }

      enrollment.transferTo(targetProgram.sportsCenterId, targetProgram.id);

      await this.enrollmentRepo.save(enrollment);

      return {
        childIin: child.childIin,
        childName: child.childName,
        success: true,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return this.failResult(child, message);
    }
  }

  private failResult(child: AppealChild, error: string): ChildTransferResult {
    return {
      childIin: child.childIin,
      childName: child.childName,
      success: false,
      error,
    };
  }
}
