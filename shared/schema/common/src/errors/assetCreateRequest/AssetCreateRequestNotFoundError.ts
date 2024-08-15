import { RuntimeError } from '@ddd/errors';

export interface AssetCreateRequestNotFoundErrorParams {
  id: string;
}

export class AssetCreateRequestNotFoundError extends RuntimeError<AssetCreateRequestNotFoundErrorParams> {
  constructor(id: string) {
    super('AssetCreateRequestNotFoundError', { id });
  }

  get message(): string {
    return `Asset request not found with id: '${this.params.id}'`;
  }
}
