import { RuntimeError } from '@ddd/errors';

@RuntimeError.RegisterError('NotImplementedMethodError')
export class NotImplementedMethodError extends RuntimeError {
  constructor() {
    super('NotImplementedMethodError', {});
  }

  get message(): string {
    return `Method is not implemented.`;
  }
}
