import { ConstructorType } from '@ddd/core';
import { Enumeration, EnumerationID } from '@ddd/domain';
import { AnyEntity, Enum, EnumOptions } from '@mikro-orm/core';

import { EnumArrayType } from './EnumArrayType';

type OmitEnumOptions = Omit<EnumOptions<any>, 'items' | 'array' | 'nativeEnumName'>;

export type EnumSnapshot<T extends Enumeration<any>> = EnumerationID<T>;

export interface EnumFactory<T> {
  (options: OmitEnumOptions): (target: AnyEntity, propertyName: string) => any;
  array(options: OmitEnumOptions): (target: AnyEntity, propertyName: string) => any;
}

export function EnumSnapshot<TEnumeration extends Enumeration<any>>(enumeration: ConstructorType<TEnumeration, typeof Enumeration>) {
  const getItems = () => {
    return enumeration.getAllIds();
  };
  const factory: EnumFactory<TEnumeration> = (options) => {
    const items = getItems();
    return Enum({ items, ...options });
  };
  factory.array = (options) => {
    const items = getItems();
    return Enum({ type: new EnumArrayType(enumeration.getAllIds()), array: true, ...options });
  };

  return factory;
}
