import { RuntimeError } from '@ddd/errors';

export interface BidForbiddenMakeActiveErrorParams {
  id: number;
}

@RuntimeError.RegisterError('BidForbiddenMakeActiveError')
export class BidForbiddenMakeActiveError extends RuntimeError<BidForbiddenMakeActiveErrorParams> {
  constructor(id: number) {
    super('BidForbiddenMakeActiveError', { id });
  }

  get message(): string {
    return `Only offer maker can accept bid`;
  }
}
