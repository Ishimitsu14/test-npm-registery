import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class KeyResultStatus extends Enumeration<LotManagementSchema.KeyResultStatus> {
  static NEW = new KeyResultStatus('NEW');
  static PROCESS = new KeyResultStatus('PROCESS');
  static COMPLETED = new KeyResultStatus('COMPLETED');
  static FAILED = new KeyResultStatus('FAILED');
}
