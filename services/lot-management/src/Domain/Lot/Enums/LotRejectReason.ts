import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class LotRejectReason extends Enumeration<LotManagementSchema.LotRejectReason> {
  static INVALID_DATA = new LotRejectReason('INVALID_DATA');
}
