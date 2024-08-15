import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class UserPK extends EntityKey {
  static raw(userId: string) {
    return new UserPK(userId);
  }

  static fromSnapshot(id: string) {
    return new UserPK(id);
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
    return [this.id];
  }
}
