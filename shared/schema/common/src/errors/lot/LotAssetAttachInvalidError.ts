import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotAssetAttachInvalidError')
export class LotAssetAttachInvalidError extends RuntimeError<{}> {
  constructor() {
    super('LotAssetAttachInvalidError', {});
  }

  get message(): string {
    return `LotAssetAttachInvalidError`;
  }
}
