import { NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Asset } from '../Asset';
import { AssetVertical } from '../Enums';

export class AssetByVerticalsSpecification extends Specification<Asset> {
  readonly verticals: AssetVertical[];

  constructor(vertical: AssetVertical | AssetVertical[]) {
    super();

    this.verticals = Array.isArray(vertical) ? vertical : [vertical];

    this.addFilter((asset) => {
      return asset.info.verticals.items.some((vertical) => NullableObject.hasValue(this.verticals.find((m) => m.isEquals(vertical))));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.verticals];
  }
}
