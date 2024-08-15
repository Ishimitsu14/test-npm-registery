import { Sortable } from '@ddd/specifications';

import { LotQuestion } from '../LotQuestion';

export class LotQuestionCreatedAtSortable extends Sortable<LotQuestion> {
  protected initialize(): void {
    this.addSort((item) => item.createdAt);
  }
}
