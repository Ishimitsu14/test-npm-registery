import { RuntimeError } from '@ddd/errors';

export interface BidForbiddenRejectErrorParams {
  id: number;
}

@RuntimeError.RegisterError('BidForbiddenRejectError')
export class BidForbiddenRejectError extends RuntimeError<BidForbiddenRejectErrorParams> {
  constructor(id: number) {
    super('BidForbiddenRejectError', { id });
  }

  get message(): string {
    return `Only offer maker can reject bid`;
  }
}
