import { NullableObject } from '@ddd/core';

import { S3File } from './S3FileEntity';
import { S3FilePK } from './S3FilePK';

export interface IS3FileStore {
  add(file: S3File): Promise<void>;
  remove(file: S3File | S3FilePK): Promise<void>;
  removeMany(files: (S3File | S3FilePK)[]): Promise<void>;
  get(pk: S3FilePK): Promise<S3File | NullableObject>;
}
