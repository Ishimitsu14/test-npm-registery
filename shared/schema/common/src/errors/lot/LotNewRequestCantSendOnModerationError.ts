import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotNewRequestCantSendOnModerationError')
export class LotNewRequestCantSendOnModerationError extends RuntimeError<{}> {
  constructor() {
    super('LotNewRequestCantSendOnModerationError', {});
  }

  get message(): string {
    return `LotNewRequestCantSendOnModerationError`;
  }
}
