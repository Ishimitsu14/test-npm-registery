import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class BidPK extends EntityKey {
  static create(id: number) {
    return new BidPK(id);
  }

  static fromSnapshot(id: number) {
    return new BidPK(id);
  }

  constructor(readonly id: number) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.id];
  }
}
