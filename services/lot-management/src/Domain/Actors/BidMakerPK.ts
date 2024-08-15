import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class BidMakerPK extends EntityKey {
  static create(userId: string) {
    return new BidMakerPK(userId);
  }
  static fromSnapshot(id: string) {
    return new BidMakerPK(id);
  }

  readonly userId: string;

  private constructor(userId: string) {
    super();

    this.userId = userId;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.userId];
  }
}
