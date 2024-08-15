import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class LotQuestionStatus extends Enumeration<LotManagementSchema.LotQuestionStatus> {
  static ON_MODERATION = new LotQuestionStatus('ON_MODERATION');
  static ACTIVE = new LotQuestionStatus('ACTIVE');
  static REJECTED = new LotQuestionStatus('REJECTED');
}
