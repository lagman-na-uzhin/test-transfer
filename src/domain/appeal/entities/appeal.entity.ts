export type AppealStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface AppealChildProps {
  id: string;
  appealId: string;
  childIin: string;
  childName: string;
}

export class AppealChild {
  constructor(private readonly props: AppealChildProps) {}

  get id(): string { return this.props.id; }
  get childIin(): string { return this.props.childIin; }
  get childName(): string { return this.props.childName; }
}

export interface AppealProps {
  id: string;
  category: string;
  status: AppealStatus;
  message: string;
  children: AppealChild[];
}

export class Appeal {
  constructor(private props: AppealProps) {}

  get id(): string { return this.props.id; }
  get category(): string { return this.props.category; }
  get status(): AppealStatus { return this.props.status; }
  get message(): string { return this.props.message; }
  get children(): AppealChild[] { return this.props.children; }

  isChangeProvider(): boolean {
    return this.props.category === 'CHANGE_PROVIDER';
  }

  isOpen(): boolean {
    return this.props.status === 'OPEN';
  }

  resolve(): void {
    if (this.props.status === 'RESOLVED') {
      throw new Error('Appeal is already resolved');
    }
    this.props.status = 'RESOLVED';
  }

  parseTransferBlock(): ParsedTransferBlock {
    const msg = this.props.message;

    const voucherEmail = extractField(msg, 'Email ваучера');
    const currentProviderId = extractField(msg, 'ID текущего поставщика');
    const desiredProviderId = extractField(msg, 'ID желаемого поставщика');
    const currentSportType = extractField(msg, 'Текущий вид спорта');
    const desiredSportType = extractField(msg, 'Желаемый вид спорта');

    if (!currentProviderId || !desiredProviderId || !desiredSportType) {
      throw new InvalidTransferBlockError(
        'Appeal message is missing required transfer fields',
      );
    }

    return { voucherEmail, currentProviderId, desiredProviderId, currentSportType, desiredSportType };
  }
}

function extractField(text: string, label: string): string {
  const regex = new RegExp(`${label}:\\s*(.+)`);
  const match = text.match(regex);
  return match?.[1]?.trim() ?? '';
}

export interface ParsedTransferBlock {
  voucherEmail: string;
  currentProviderId: string;
  desiredProviderId: string;
  currentSportType: string;
  desiredSportType: string;
}

export class InvalidTransferBlockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTransferBlockError';
  }
}
