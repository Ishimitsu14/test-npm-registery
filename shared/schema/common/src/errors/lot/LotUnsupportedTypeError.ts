import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotUnsupportedTypeError')
export class LotUnsupportedTypeError extends RuntimeError<{}> {
  constructor() {
    super('LotUnsupportedTypeError', {});
  }

  get message(): string {
    return `LotUnsupportedTypeError`;
  }
}
