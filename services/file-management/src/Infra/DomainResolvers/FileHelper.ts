import { Nullable, NullableObject } from '@ddd/core';
import { FileManagementConfig } from '@shared/config';
import { enc, SHA256 } from 'crypto-js';
import { v4 } from 'uuid';

import { FileType, IFileHelper, S3FilePK } from '../../Domain';

const FILE_EXTENSION_REGEXP = /(?:\.([^.]+))?$/;

export class FileHelper implements IFileHelper {
  getExtensionFromFileName(fileName: string): Nullable<string> {
    return NullableObject.map(fileName, (m) => FILE_EXTENSION_REGEXP.exec(m)?.[1]);
  }
  getFileTypeFromMimeType(mimeType: string): FileType {
    return FileType.IMAGE;
  }

  async generateS3FilePK(prefix: Nullable<string>, extension: Nullable<string>): Promise<S3FilePK> {
    const randomKey =
      v4() +
      SHA256(v4() + Date.now())
        .toString(enc.Hex)
        .substring(0, 16);
    const id =
      [prefix, randomKey].filter(NullableObject.hasValue).join('-') +
      NullableObject(
        NullableObject.map(extension, (m) => '.' + m.toLowerCase()),
        '',
      );

    return S3FilePK.create(FileManagementConfig.s3.bucket, id);
  }
}
