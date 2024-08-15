import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotCantSendToModerateError')
export class LotCantSendToModerateError extends RuntimeError<{}> {
  constructor() {
    super('LotCantSendToModerateError', {});
  }

  get message(): string {
    return `LotCantSendToModerateError`;
  }
}
