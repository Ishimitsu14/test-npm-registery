import { ISnapshot } from '@ddd/infra';
import { Embeddable, Property } from '@mikro-orm/core';
import { S3FilePK } from 'services/file-management/src/Domain';

@Embeddable()
export class S3FilePKSnapshot implements ISnapshot<S3FilePK> {
  @Property({ fieldName: 'bucket', type: 'string' })
  bucket: string;

  @Property({ fieldName: 'key', type: 'string' })
  key: string;

  applyDomain(domain: S3FilePK): void {
    this.bucket = domain.bucket;
    this.key = domain.key;
  }

  toDomain(): S3FilePK {
    const bucket = this.bucket;
    const key = this.key;

    return S3FilePK.fromSnapshot(bucket, key);
  }
}
