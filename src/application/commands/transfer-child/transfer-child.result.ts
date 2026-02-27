export interface ChildTransferResult {
  childIin: string;
  childName: string;
  success: boolean;
  error?: string;
}

export interface TransferChildResult {
  success: boolean;
  allTransferred: boolean;
  results: ChildTransferResult[];
}
