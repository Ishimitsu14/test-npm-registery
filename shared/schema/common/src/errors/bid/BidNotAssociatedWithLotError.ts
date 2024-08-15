import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('BidNotAssociatedWithLotError')
export class BidNotAssociatedWithLotError extends RuntimeError<{ lotId: number }> {
  constructor(lotId: number) {
    super('BidNotAssociatedWithLotError', { lotId });
  }

  get message(): string {
    return 'BidNotAssociatedWithLotError';
  }
}
