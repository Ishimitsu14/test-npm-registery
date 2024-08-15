import { Nullable } from '@ddd/core';

import { S3FilePK } from '../../S3File';
import { FileType } from '../Enums';

export interface IFileHelper {
  getFileTypeFromMimeType(mimeType: string): FileType;
  getExtensionFromFileName(fileName: string): Nullable<string>;
  generateS3FilePK(prefix: Nullable<string>, extension: Nullable<string>): Promise<S3FilePK>;
}
