import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class FileEntityPK extends EntityKey {
  static create(id: string) {
    return new FileEntityPK(id);
  }

  static fromSnapshot(id: string) {
    return new FileEntityPK(id);
  }

  private constructor(readonly id: string) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.id];
  }
}
