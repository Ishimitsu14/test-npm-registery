import { RuntimeError } from '@ddd/errors';

export interface LotBadgeNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('LotBadgeNotFoundError')
export class LotBadgeNotFoundError extends RuntimeError<LotBadgeNotFoundErrorParams> {
  constructor(id: string) {
    super('LotBadgeNotFoundError', { id });
  }

  get message(): string {
    return `Lot badge with id ${this.params.id} not found`;
  }
}
