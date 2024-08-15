import { NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Lot, LotInputs } from '../../Lot';
import { Asset } from '../Asset';

export class AssetMatchesLotSpecification extends Specification<Asset> {
  constructor(readonly lots: Lot[] | Specification<Lot>) {
    super();

    if (Specification.isExtends(lots)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(lots)) {
      this.addFilter((asset) => {
        return lots.some((lot) => {
          const assetPK = lot.attributes.findValue(LotInputs.INVEST_DOC_ASSET_PK_INPUT);
          if (NullableObject.isEmpty(assetPK)) return false;

          return assetPK.isEquals(asset.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.lots];
  }
}
