import { NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Asset } from '../../Asset';
import { Lot, LotInputs } from '../../Lot';

export class LotByAssetSpecification extends Specification<Lot> {
  constructor(readonly assets: Asset[] | Specification<Asset>) {
    super();

    if (Specification.isExtends(assets)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(assets)) {
      this.addFilter((lot) => {
        return assets.some((asset) => {
          const assetPK = lot.attributes.findValue(LotInputs.INVEST_DOC_ASSET_PK_INPUT);
          if (NullableObject.isEmpty(assetPK)) return false;

          return assetPK.isEquals(asset.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.assets];
  }
}
