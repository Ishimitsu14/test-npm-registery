import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class LotPK extends EntityKey {
  static fromSnapshot(id: number) {
    return new LotPK(id);
  }

  readonly id: number;

  constructor(id: number) {
    super();

    this.id = id;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.id];
  }
}
