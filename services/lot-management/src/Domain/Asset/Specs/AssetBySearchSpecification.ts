import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Asset } from '../Asset';

export class AssetBySearchSpecification extends Specification<Asset> {
  constructor(readonly search: string) {
    super();

    this.addFilter((asset) => {
      return asset.info.title.toLowerCase().includes(search.toLowerCase());
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.search];
  }
}
