import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class FavoriteLotPK extends EntityKey {
  static raw(id: string) {
    return new FavoriteLotPK(id);
  }

  private readonly _id: string;

  private constructor(id: string) {
    super();
    this._id = id;
  }

  get id() {
    return this._id;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this._id];
  }
}
