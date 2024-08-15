import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class BidStatus extends Enumeration<LotManagementSchema.BidStatus> {
  static ON_MODERATION = new BidStatus('ON_MODERATION');
  static ACTIVE = new BidStatus('ACTIVE');
  static DEAL = new BidStatus('DEAL');
  static REJECTED = new BidStatus('REJECTED');
  static ARCHIVED = new BidStatus('ARCHIVED');
}
