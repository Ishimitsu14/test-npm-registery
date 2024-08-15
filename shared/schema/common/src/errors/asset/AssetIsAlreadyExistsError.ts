import { RuntimeError } from '@ddd/errors';

export interface AssetIsAlreadyExistsErrorParams {
  id: string;
}

@RuntimeError.RegisterError('AssetIsAlreadyExistsError')
export class AssetIsAlreadyExistsError extends RuntimeError<AssetIsAlreadyExistsErrorParams> {
  constructor(id: string) {
    super('AssetIsAlreadyExistsError', { id });
  }

  get message(): string {
    return `Asset with id ${this.params.id} is already exists.`;
  }
}
