import { RuntimeError } from '@ddd/errors';

export interface LotQuestionNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('LotQuestionNotFoundError')
export class LotQuestionNotFoundError extends RuntimeError<LotQuestionNotFoundErrorParams> {
  constructor(id: string) {
    super('LotQuestionNotFoundError', { id });
  }

  get message(): string {
    return `Lot Question with id ${this.params.id} not found`;
  }
}
