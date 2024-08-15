import { RuntimeError } from '@ddd/errors';

export interface BidWithDealCannotRejectErrorParams {
  id: number;
}

@RuntimeError.RegisterError('BidWithDealCannotRejectError')
export class BidWithDealCannotRejectError extends RuntimeError<BidWithDealCannotRejectErrorParams> {
  constructor(id: number) {
    super('BidWithDealCannotRejectErrorParams', { id });
  }

  get message(): string {
    return `Bid with id ${this.params.id} in DEAL status cannot reject`;
  }
}
