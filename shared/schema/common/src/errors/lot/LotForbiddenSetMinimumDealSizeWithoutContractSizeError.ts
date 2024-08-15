import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotForbiddenSetMinimumDealSizeWithoutContractSizeError')
export class LotForbiddenSetMinimumDealSizeWithoutContractSizeError extends RuntimeError<{}> {
  constructor() {
    super('LotForbiddenSetMinimumDealSizeWithoutContractSizeError', {});
  }

  get message(): string {
    return `LotForbiddenSetMinimumDealSizeWithoutContractSizeError`;
  }
}
