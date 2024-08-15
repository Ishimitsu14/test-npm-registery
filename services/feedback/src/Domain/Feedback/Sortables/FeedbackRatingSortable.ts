import { Sortable } from '@ddd/specifications';

import { Feedback } from '../Feedback';

export class FeedbackRatingSortable extends Sortable<Feedback> {
  protected initialize() {
    this.addSort((item) => item.rating);
  }
}
