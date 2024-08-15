import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('BidInvalidStateError')
export class BidInvalidStateError extends RuntimeError<{ reason?: string }> {
  constructor(reason?: string) {
    super('BidInvalidStateError', { reason });
  }

  get message(): string {
    return this.params.reason ? `BidInvalidStateError: ${this.params.reason}` : `BidInvalidStateError`;
  }
}
