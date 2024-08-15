import { RuntimeError } from '@ddd/errors';

export interface BidForbiddenAcceptErrorParams {
  id: number;
}

@RuntimeError.RegisterError('BidForbiddenAcceptError')
export class BidForbiddenAcceptError extends RuntimeError<BidForbiddenAcceptErrorParams> {
  constructor(id: number) {
    super('BidForbiddenAcceptError', { id });
  }

  get message(): string {
    return `Only offer maker can accept bid`;
  }
}
