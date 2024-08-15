import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('LotInvalidAttributeError')
export class LotInvalidAttributeError extends RuntimeError<{ attributeName: string }> {
  constructor(attributeName: string) {
    super('LotInvalidAttributeError', { attributeName });
  }

  get message(): string {
    return `LotInvalidAttributeError: ${this.params.attributeName}`;
  }
}
