import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class ModeratorPK extends EntityKey {
  static create(userId: string) {
    return new ModeratorPK(userId);
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
