import { RuntimeError } from '@ddd/errors';

export interface FileIsAlreadyUploadedErrorParams {
  id: string;
}

@RuntimeError.RegisterError('FileIsAlreadyUploadedError')
export class FileIsAlreadyUploadedError extends RuntimeError<FileIsAlreadyUploadedErrorParams> {
  constructor(id: string) {
    super('FileIsAlreadyUploadedError', { id });
  }

  get message(): string {
    return `File with id ${this.params.id} is already uploaded`;
  }
}
