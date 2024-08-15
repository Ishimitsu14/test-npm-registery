import { Nullable, NullableObject } from '@ddd/core';

import { Attribute } from './Attribute';
import { AttributeValueListCollection } from './AttributeValueListCollection';

export function useEffect(callback: () => any, deps: Attribute<any>[]) {}

export interface AttributeHook {
  callback: (attributes: AttributeValueListCollection) => void;
  deps: Nullable<Attribute<any>[]>;
}

export function registerHook(callback: (attributes: AttributeValueListCollection) => void, deps?: Attribute<any>[]): AttributeHook {
  return {
    callback,
    deps: NullableObject(deps),
  };
}
