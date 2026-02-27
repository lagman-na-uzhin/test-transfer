import { Appeal } from '../entities/appeal.entity';

export const APPEAL_REPOSITORY = Symbol('APPEAL_REPOSITORY');

export interface IAppealRepository {
  findById(id: string): Promise<Appeal | null>;
  save(appeal: Appeal): Promise<void>;
}
