import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class NotificationRequestPK extends EntityKey {
  static create(id: string) {
    return new NotificationRequestPK(id);
  }

  static fromSnapshot(id: string) {
    return new NotificationRequestPK(id);
  }

  private constructor(readonly id: string) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { id: this.id };
  }
}
