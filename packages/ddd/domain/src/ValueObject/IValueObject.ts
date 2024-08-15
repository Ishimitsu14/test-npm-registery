import { Equatable } from '@ddd/core';

export interface IValueObject extends Equatable<IValueObject> {
  isEquals(other: IValueObject): boolean;
}
