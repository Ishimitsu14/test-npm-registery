import { RuntimeError } from '@ddd/errors';

export interface BidCannotCreateWhenLotIsNotActiveErrorParams {
  id: number;
}

@RuntimeError.RegisterError('BidCannotCreateWhenLotIsNotActiveError')
export class BidCannotCreateWhenLotIsNotActiveError extends RuntimeError<BidCannotCreateWhenLotIsNotActiveErrorParams> {
  constructor(id: number) {
    super('BidCannotCreateWhenLotIsNotActiveError', { id });
  }

  get message(): string {
    return `Bid can not create when lot with id ${this.params.id} is not active`;
  }
}
