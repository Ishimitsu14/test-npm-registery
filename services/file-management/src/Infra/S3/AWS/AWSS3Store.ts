import { DeleteObjectsCommand, NoSuchKey, S3 } from '@aws-sdk/client-s3';
import LINQ from '@berish/linq';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';

import { IS3FileStore, S3File, S3FilePK } from '../../../Domain';

export class AWSS3Store implements IS3FileStore {
  @Inject(S3)
  public readonly s3: S3;

  async add(file: S3File): Promise<void> {
    await this.s3.putObject({
      Bucket: file.primaryKey.bucket,
      Key: file.primaryKey.key,
      Body: await file.getContentAsBuffer(),
      ACL: 'private',
    });
  }

  async remove(file: S3File | S3FilePK): Promise<void> {
    const pk = S3File.isExtends(file) ? file.primaryKey : file;
    await this.s3.deleteObject({ Bucket: pk.bucket, Key: pk.key });
  }

  async removeMany(files: (S3File | S3FilePK)[]): Promise<void> {
    const pks = files.map((file) => (S3File.isExtends(file) ? file.primaryKey : file));

    const groupByBucket = LINQ.from(pks)
      .groupBy((m) => m.bucket)
      .toArray();

    const deleteCommands = groupByBucket.map(([bucket, pks]) => new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: pks.map((m) => ({ Key: m.key })) } }));
    await Promise.all(deleteCommands.map((command) => this.s3.send(command)));
  }

  async get(pk: S3FilePK): Promise<S3File | NullableObject> {
    try {
      const s3Object = await this.s3.getObject({ Bucket: pk.bucket, Key: pk.key });
      const buffer = Buffer.from(await s3Object.Body.transformToByteArray());
      return S3File.createFromBuffer(pk, buffer);
    } catch (err) {
      if (err instanceof NoSuchKey) return NullableObject;
      throw err;
    }
  }
}
