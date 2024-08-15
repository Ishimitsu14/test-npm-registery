import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class DealTransactionPK extends EntityKey {
  static fromSnapshot(id: string) {
    return new DealTransactionPK(id);
  }

  private constructor(readonly id: string) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.id];
  }
}
