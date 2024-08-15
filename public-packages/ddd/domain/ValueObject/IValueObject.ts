import { Equatable } from '../../core';

export interface IValueObject extends Equatable<IValueObject> {
  isEquals(other: IValueObject): boolean;
}
