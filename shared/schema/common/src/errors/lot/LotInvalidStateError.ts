import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotInvalidStateError')
export class LotInvalidStateError extends RuntimeError<{ reason?: string }> {
  constructor(reason?: string) {
    super('LotInvalidStateError', { reason });
  }

  get message(): string {
    return this.params.reason ? `LotInvalidStateError: ${this.params.reason}` : `LotInvalidStateError`;
  }
}
