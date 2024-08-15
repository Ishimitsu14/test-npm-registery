import { RuntimeError } from '@ddd/errors';

export interface LotNotFoundErrorParams {
  id: number;
}

@RuntimeError.RegisterError('LotNotFoundError')
export class LotNotFoundError extends RuntimeError<LotNotFoundErrorParams> {
  constructor(id: number) {
    super('LotNotFoundError', { id });
  }

  get message(): string {
    return `Lot with id ${this.params.id} not found`;
  }
}
