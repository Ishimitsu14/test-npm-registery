import { RuntimeError } from '@ddd/errors';

export interface AssetFaqNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('AssetFaqNotFoundError')
export class AssetFaqNotFoundError extends RuntimeError<AssetFaqNotFoundErrorParams> {
  constructor(id: string) {
    super('AssetFaqNotFoundError', { id });
  }

  get message(): string {
    return `Asset FAQ with id ${this.params.id} not found`;
  }
}
