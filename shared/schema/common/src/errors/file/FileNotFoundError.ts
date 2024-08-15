import { RuntimeError } from '@ddd/errors';

export interface FileNotFoundErrorParams {
  id: string;
}

@RuntimeError.RegisterError('FileNotFoundError')
export class FileNotFoundError extends RuntimeError<FileNotFoundErrorParams> {
  constructor(id: string) {
    super('FileNotFoundError', { id });
  }

  get message(): string {
    return `File with id ${this.params.id} not found`;
  }
}
