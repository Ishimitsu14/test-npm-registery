import { RuntimeError } from '@ddd/errors';

export interface BidNotFoundErrorParams {
  id: number;
}

@RuntimeError.RegisterError('BidNotFoundError')
export class BidNotFoundError extends RuntimeError<BidNotFoundErrorParams> {
  constructor(id: number) {
    super('BidNotFoundError', { id });
  }

  get message(): string {
    return `Bid with id ${this.params.id} not found`;
  }
}
