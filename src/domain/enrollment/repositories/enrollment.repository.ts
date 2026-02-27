import { Enrollment } from '../entities/enrollment.entity';

export const ENROLLMENT_REPOSITORY = Symbol('ENROLLMENT_REPOSITORY');

export interface IEnrollmentRepository {
  findApprovedByAthleteAndCenter(
    athleteProfileId: string,
    sportsCenterId: string,
  ): Promise<Enrollment | null>;
  save(enrollment: Enrollment): Promise<void>;
}
