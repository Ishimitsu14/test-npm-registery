import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotCantMakeActiveError')
export class LotCantMakeActiveError extends RuntimeError<{}> {
  constructor() {
    super('LotCantMakeActiveError', {});
  }

  get message(): string {
    return `LotCantMakeActiveError`;
  }
}
