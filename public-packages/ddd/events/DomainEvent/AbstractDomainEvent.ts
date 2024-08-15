import { IDomainEvent, ValueObject, ValueObjectAtomicValue } from '../../domain';

export abstract class AbstractDomainEvent extends ValueObject implements IDomainEvent {
  readonly createdAt: Date = new Date();

  protected abstract getEventAtomicValues(): ValueObjectAtomicValue;

  protected getAtomicValues(): ValueObjectAtomicValue {
    return Object.assign({ createdAt: this.createdAt }, this.getEventAtomicValues());
  }
}
