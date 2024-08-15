import { Sortable } from '@ddd/specifications';

import { Feedback } from '../Feedback';

export class FeedbackCreatedAtSortable extends Sortable<Feedback> {
  protected initialize() {
    this.addSort((item) => item.createdAt);
  }
}
