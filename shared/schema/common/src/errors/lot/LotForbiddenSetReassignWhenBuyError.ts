import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotForbiddenSetReassignWhenBuyError')
export class LotForbiddenSetReassignWhenBuyError extends RuntimeError<{}> {
  constructor() {
    super('LotForbiddenSetReassignWhenBuyError', {});
  }

  get message(): string {
    return `LotForbiddenSetReassignWhenBuyError`;
  }
}
