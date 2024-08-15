import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Asset } from '../Asset';
import { AssetStatus } from '../Enums';

export class AssetByStatusSpecification extends Specification<Asset> {
  readonly statuses: AssetStatus[];

  constructor(status: AssetStatus | AssetStatus[]) {
    super();

    this.statuses = Array.isArray(status) ? status : [status];

    this.addFilter((lot) => {
      return this.statuses.indexOf(lot.status) !== -1;
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.statuses];
  }
}
