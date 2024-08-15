import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class AssetPK extends EntityKey {
  static fromSnapshot(id: string) {
    return new AssetPK(id);
  }

  public constructor(readonly id: string) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.id];
  }
}
