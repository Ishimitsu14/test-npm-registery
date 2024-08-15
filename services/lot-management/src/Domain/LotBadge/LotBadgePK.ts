import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class LotBadgePK extends EntityKey {
  static raw(id: string) {
    return new LotBadgePK(id);
  }

  static fromSnapshot(id: string) {
    return new LotBadgePK(id);
  }

  readonly id: string;

  constructor(id: string) {
    super();

    this.id = id;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.id];
  }
}
