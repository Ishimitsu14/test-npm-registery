import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { LotType } from '../Enums';
import { Lot } from '../Lot';

export class LotByTypeSpecification extends Specification<Lot> {
  readonly types: LotType[];

  constructor(type: LotType | LotType[]) {
    super();

    this.types = Array.isArray(type) ? type : [type];

    this.addFilter((lot) => {
      return this.types.indexOf(lot.type) !== -1;
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.types];
  }
}
