import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotCantCancelToDraftError')
export class LotCantCancelToDraftError extends RuntimeError<{}> {
  constructor() {
    super('LotCantCancelToDraftError', {});
  }

  get message(): string {
    return `LotCantCancelToDraftError`;
  }
}
