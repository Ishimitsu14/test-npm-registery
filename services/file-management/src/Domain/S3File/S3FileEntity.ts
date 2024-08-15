import { GetObjectOutput } from '@aws-sdk/client-s3';
import { Entity } from '@ddd/domain';

import { S3FilePK } from './S3FilePK';

export class S3File extends Entity<S3FilePK> {
  static createFromBuffer(pk: S3FilePK, buffer: Buffer) {
    return new S3File(pk, () => Promise.resolve(buffer));
  }

  static createFromGetObjectOutput(payload: GetObjectOutput) {}

  readonly primaryKey: S3FilePK;

  private _getBuffer: () => Promise<Buffer>;

  constructor(pk: S3FilePK, getBuffer: () => Promise<Buffer>) {
    super();

    this.primaryKey = pk;
    this._getBuffer = getBuffer;
  }

  getContentAsBuffer(): Promise<Buffer> {
    return this._getBuffer();
  }
}
