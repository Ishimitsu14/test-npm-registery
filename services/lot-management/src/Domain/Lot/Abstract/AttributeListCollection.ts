import { ListCollection } from '@ddd/core';

import { Attribute } from './Attribute';

export class AttributeListCollection extends ListCollection<Attribute<any>> {
  override clone() {
    return new AttributeListCollection(this);
  }
}
