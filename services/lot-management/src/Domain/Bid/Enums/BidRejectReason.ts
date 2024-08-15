import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class BidRejectReason extends Enumeration<LotManagementSchema.BidRejectReasonType> {
  static OFFER_MAKER_REJECT = new BidRejectReason('OFFER_MAKER_REJECT');
  static MODERATOR_REJECT = new BidRejectReason('MODERATOR_REJECT');
}
