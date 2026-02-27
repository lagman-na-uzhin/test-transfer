export const ATHLETE_PROFILE_REPOSITORY = Symbol('ATHLETE_PROFILE_REPOSITORY');

export interface IAthleteProfileRepository {
  findIdByIin(iin: string): Promise<string | null>;
}
