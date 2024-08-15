import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { AssetPK } from '../../Asset';
import { AssetFaq } from '../AssetFaq';

export class AssetFaqByAssetSpecfication extends Specification<AssetFaq> {
  readonly assetPKs: AssetPK[];

  constructor(assetPK: AssetPK | AssetPK[]) {
    super();

    this.assetPKs = Array.isArray(assetPK) ? assetPK : [assetPK];

    this.addFilter((assetFaq) => {
      return this.assetPKs.some((m) => assetFaq.assetPK.isEquals(m));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.assetPKs];
  }
}
