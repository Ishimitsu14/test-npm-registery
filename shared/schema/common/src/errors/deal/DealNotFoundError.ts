import { RuntimeError } from '@ddd/errors';

export interface DealNotFoundErrorParams {
  id: number;
}

@RuntimeError.RegisterError('DealNotFoundError')
export class DealNotFoundError extends RuntimeError<DealNotFoundErrorParams> {
  constructor(id: number) {
    super('DealNotFoundError', { id });
  }

  get message(): string {
    return `Deal with id ${this.params.id} not found`;
  }
}
