import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotNewRequestSetRoundInfoWhenBuyError')
export class LotNewRequestSetRoundInfoWhenBuyError extends RuntimeError<{}> {
  constructor() {
    super('LotNewRequestSetRoundInfoWhenBuyError', {});
  }

  get message(): string {
    return `LotNewRequestSetRoundInfoWhenBuyError`;
  }
}
