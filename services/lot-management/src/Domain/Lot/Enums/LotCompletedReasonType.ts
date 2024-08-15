import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class LotCompletedReasonType extends Enumeration<LotManagementSchema.LotCompletedReasonType> {
  static DEADLINE = new LotCompletedReasonType('DEADLINE');
  static FULFILLED = new LotCompletedReasonType('FULFILLED');
  static MANUALLY = new LotCompletedReasonType('MANUALLY');
}
