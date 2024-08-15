import { RuntimeError } from '@ddd/errors';

export interface AssetNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('AssetNotFoundError')
export class AssetNotFoundError extends RuntimeError<AssetNotFoundErrorParams> {
  constructor(id: string) {
    super('AssetNotFoundError', { id });
  }

  get message(): string {
    return `Asset with id ${this.params.id} not found`;
  }
}
