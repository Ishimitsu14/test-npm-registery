import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Lot } from '../Lot';

export class LotByIsHotSpecification extends Specification<Lot> {
  constructor(readonly isHot: boolean) {
    super();

    this.addFilter((lot) => {
      return lot.isHot === isHot;
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.isHot];
  }
}
