import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { LotQuestion } from '../LotQuestion';

export class LotQuestionApprovedEvent extends AbstractDomainEvent {
  constructor(readonly lotQuestion: LotQuestion) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { lotQuestion: this.lotQuestion };
  }
}
