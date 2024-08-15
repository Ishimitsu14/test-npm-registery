import LINQ from '@berish/linq';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { S3 } from 'mock-aws-s3';

import { IS3FileStore, S3File, S3FilePK } from '../../../Domain';

export class MockS3Store implements IS3FileStore {
  @Inject(S3)
  public readonly s3: S3;

  async add(file: S3File): Promise<void> {
    await this.s3
      .putObject({
        Bucket: file.primaryKey.bucket,
        Key: file.primaryKey.key,
        Body: await file.getContentAsBuffer(),
        ACL: 'private',
      })
      .promise();
  }

  async remove(file: S3File | S3FilePK): Promise<void> {
    const pk = S3File.isExtends(file) ? file.primaryKey : file;
    await this.s3.deleteObject({ Bucket: pk.bucket, Key: pk.key }).promise();
  }

  async removeMany(files: (S3File | S3FilePK)[]): Promise<void> {
    const pks = files.map((file) => (S3File.isExtends(file) ? file.primaryKey : file));

    const groupByBucket = LINQ.from(pks)
      .groupBy((m) => m.bucket)
      .toArray();

    const deleteCommands = groupByBucket.map(([bucket, pks]) => this.s3.deleteObjects({ Bucket: bucket, Delete: { Objects: pks.map((m) => ({ Key: m.key })) } }));
    await Promise.all(deleteCommands.map((command) => command.promise()));
  }

  async get(pk: S3FilePK): Promise<S3File | NullableObject> {
    try {
      const s3Object = await this.s3.getObject({ Bucket: pk.bucket, Key: pk.key }).promise();
      const buffer = Buffer.from(s3Object.Body as Buffer);
      return S3File.createFromBuffer(pk, buffer);
    } catch (err) {
      if (err?.['name'] === 'NoSuchKey') return NullableObject;
      throw err;
    }
  }
}
