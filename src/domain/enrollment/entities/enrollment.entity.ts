export type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface EnrollmentProps {
  id: string;
  athleteProfileId: string;
  sportsCenterId: string;
  programId: string;
  status: EnrollmentStatus;
}

export class Enrollment {
  constructor(private props: EnrollmentProps) {}

  get id(): string { return this.props.id; }
  get athleteProfileId(): string { return this.props.athleteProfileId; }
  get sportsCenterId(): string { return this.props.sportsCenterId; }
  get programId(): string { return this.props.programId; }
  get status(): EnrollmentStatus { return this.props.status; }

  isApproved(): boolean {
    return this.props.status === 'APPROVED';
  }

  transferTo(newCenterId: string, newProgramId: string): void {
    if (!this.isApproved()) {
      throw new EnrollmentNotApprovedError(
        `Cannot transfer enrollment ${this.props.id}: status is ${this.props.status}`,
      );
    }
    this.props.sportsCenterId = newCenterId;
    this.props.programId = newProgramId;
    this.props.status = 'PENDING';
  }
}

export class EnrollmentNotApprovedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnrollmentNotApprovedError';
  }
}
