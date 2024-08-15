import { Enumeration } from '@ddd/domain';

export const DealTransactionStatusScalar = ['RESERVED', 'EXECUTED', 'FAILED'] as const;
export type DealTransactionStatusScalar = (typeof DealTransactionStatusScalar)[number];

export class DealTransactionStatus extends Enumeration<DealTransactionStatusScalar> {
  static RESERVED = new DealTransactionStatus('RESERVED');
  static EXECUTED = new DealTransactionStatus('EXECUTED');
  static FAILED = new DealTransactionStatus('FAILED');
}
