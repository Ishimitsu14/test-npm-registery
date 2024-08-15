import { Sortable } from '@ddd/specifications';

import { LotInputs } from '../Inputs';
import { Lot } from '../Lot';

export class LotCommonBadgeSortable extends Sortable<Lot> {
  protected initialize(): void {
    this.addSort((item) => item.attributes.findValue(LotInputs.COMMON_BADGE_INPUT));
  }
}
