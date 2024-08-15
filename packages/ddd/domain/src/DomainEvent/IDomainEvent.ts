import { IValueObject } from '../ValueObject';

export interface IDomainEvent extends IValueObject {
  readonly createdAt: Date;
}
