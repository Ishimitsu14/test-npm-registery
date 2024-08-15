import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { AssetBySearchSpecification } from '../../Asset';
import { Lot } from '../Lot';
import { LotByAssetSpecification } from './LotByAssetSpecification';

export class LotBySearchSpecification extends Specification<Lot> {
  constructor(readonly search: string) {
    super();

    this.addSpecification(new LotByAssetSpecification(new AssetBySearchSpecification(search)));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.search];
  }
}
