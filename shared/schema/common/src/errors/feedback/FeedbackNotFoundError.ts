import { RuntimeError } from '@ddd/errors';

export interface FeedbackNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('FeedbackNotFoundError')
export class FeedbackNotFoundError extends RuntimeError<FeedbackNotFoundErrorParams> {
  constructor(id: string) {
    super('FeedbackNotFoundError', { id });
  }

  get message(): string {
    return `Feedback with id: ${this.params.id} not found`;
  }
}
