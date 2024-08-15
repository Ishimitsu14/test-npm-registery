import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class DealStatus extends Enumeration<LotManagementSchema.DealStatus> {
  static NEGOTIATION = new DealStatus('NEGOTIATION');
  static COMPLETED = new DealStatus('COMPLETED');
  static REJECTED = new DealStatus('REJECTED');
}
