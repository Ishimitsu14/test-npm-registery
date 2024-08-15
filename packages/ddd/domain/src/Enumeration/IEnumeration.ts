import { Equatable } from '@ddd/core';

export interface IEnumeration<Identificator extends string> extends Equatable<IEnumeration<Identificator>> {
  readonly id: Identificator;
}
