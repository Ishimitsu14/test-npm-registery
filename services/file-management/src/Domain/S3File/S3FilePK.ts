import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class S3FilePK extends EntityKey {
  static create(bucket: string, key: string) {
    return new S3FilePK(bucket, key);
  }

  static fromSnapshot(bucket: string, key: string) {
    return new S3FilePK(bucket, key);
  }

  private constructor(
    readonly bucket: string,
    readonly key: string,
  ) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.bucket, this.key];
  }
}
