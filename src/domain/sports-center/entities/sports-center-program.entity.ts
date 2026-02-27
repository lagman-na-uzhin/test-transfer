export interface SportsCenterProgramProps {
  id: string;
  sportsCenterId: string;
  sportType: string;
  capacity: int;
  enrollmentCount: number;
}

export class SportsCenterProgram {
  constructor(private readonly props: SportsCenterProgramProps) {}

  get id(): string { return this.props.id; }
  get sportsCenterId(): string { return this.props.sportsCenterId; }
  get sportType(): string { return this.props.sportType; }
  get capacity(): number { return this.props.capacity; }
  get enrollmentCount(): number { return this.props.enrollmentCount; }

  hasAvailableSlot(): boolean {
    return this.props.enrollmentCount < this.props.capacity;
  }
}

// Fix TS type alias
type int = number;
