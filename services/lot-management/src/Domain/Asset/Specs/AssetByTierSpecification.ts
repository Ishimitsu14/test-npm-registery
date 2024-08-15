import { NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Asset } from '../Asset';
import { AssetTier } from '../Enums';

export class AssetByTierSpecification extends Specification<Asset> {
  readonly tiers: AssetTier[];

  constructor(tier: AssetTier | AssetTier[]) {
    super();

    this.tiers = Array.isArray(tier) ? tier : [tier];
    this.addFilter((asset) => NullableObject.hasValue(this.tiers.find((m) => m.isEquals(asset.info.tier))));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.tiers];
  }
}
