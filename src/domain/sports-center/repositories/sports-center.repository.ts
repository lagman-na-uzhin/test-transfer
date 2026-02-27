import { SportsCenterProgram } from '../entities/sports-center-program.entity';

export const SPORTS_CENTER_REPOSITORY = Symbol('SPORTS_CENTER_REPOSITORY');

export interface ISportsCenterRepository {
  existsById(id: string): Promise<boolean>;
  findAvailableProgram(
    sportsCenterId: string,
    sportType: string,
  ): Promise<SportsCenterProgram | null>;
}
