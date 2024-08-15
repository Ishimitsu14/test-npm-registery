import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class LotStatus extends Enumeration<LotManagementSchema.LotStatus> {
  static DRAFT = new LotStatus('DRAFT');
  static ON_MODERATION = new LotStatus('ON_MODERATION');
  static ACTIVE = new LotStatus('ACTIVE');
  static REJECTED = new LotStatus('REJECTED');
  static COMPLETED = new LotStatus('COMPLETED');
  static ARCHIVED = new LotStatus('ARCHIVED');
}
