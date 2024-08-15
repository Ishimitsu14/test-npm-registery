import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class OfferMakerPK extends EntityKey {
  static create(userId: string) {
    return new OfferMakerPK(userId);
  }

  static fromSnapshot(id: string) {
    return new OfferMakerPK(id);
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
