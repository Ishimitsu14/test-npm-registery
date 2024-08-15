import { IValueObject } from '../ValueObject';

export interface IEntityKey extends IValueObject {
  hasKey(): boolean;
}
