import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class NotePK extends EntityKey {
  static create(id: string) {
    return new NotePK(id);
  }

  static raw(id: string) {
    return new NotePK(id);
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
