import { RuntimeError } from '@ddd/errors';

export interface FavoriteLotNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('FavoriteLotNotFoundError')
export class FavoriteLotNotFoundError extends RuntimeError<FavoriteLotNotFoundErrorParams> {
  constructor(id: string) {
    super('FavoriteLotNotFoundError', { id });
  }

  get message(): string {
    return `Favorite lot with id ${this.params.id} not found`;
  }
}
