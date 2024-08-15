import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { LotQuestionStatus } from '../Enums';
import { LotQuestion } from '../LotQuestion';

export class LotQuestionByStatusSpecification extends Specification<LotQuestion> {
  readonly statuses: LotQuestionStatus[];

  constructor(status: LotQuestionStatus | LotQuestionStatus[]) {
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
