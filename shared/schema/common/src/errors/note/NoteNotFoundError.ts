import { RuntimeError } from '@ddd/errors';

export interface NoteNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('NoteNotFoundError')
export class NoteNotFoundError extends RuntimeError<NoteNotFoundErrorParams> {
  constructor(id: string) {
    super('NoteNotFoundError', { id });
  }

  get message(): string {
    return `Note with id: ${this.params.id} not found`;
  }
}
