import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { LotPK } from '../../Lot';
import { LotQuestion } from '../LotQuestion';

export class LotQuestionByLotSpecfication extends Specification<LotQuestion> {
  readonly lotPKs: LotPK[];

  constructor(lotPK: LotPK | LotPK[]) {
    super();

    this.lotPKs = Array.isArray(lotPK) ? lotPK : [lotPK];

    this.addFilter((lotQuestion) => {
      return this.lotPKs.some((m) => lotQuestion.lotPK.isEquals(m));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.lotPKs];
  }
}
