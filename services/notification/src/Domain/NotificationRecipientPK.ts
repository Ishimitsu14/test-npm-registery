import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class NotificationRecipientPK extends EntityKey {
  static create(id: string) {
    return new NotificationRecipientPK(id);
  }

  static fromSnapshot(id: string) {
    return new NotificationRecipientPK(id);
  }

  private constructor(readonly id: string) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { id: this.id };
  }
}
