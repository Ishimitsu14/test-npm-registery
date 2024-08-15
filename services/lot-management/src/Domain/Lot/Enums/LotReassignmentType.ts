import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class LotReassignmentType extends Enumeration<LotManagementSchema.LotReassignmentType> {
  static DIRECT = new LotReassignmentType('DIRECT');
  static SPV = new LotReassignmentType('SPV');
  static FORWARD_CONTRACT = new LotReassignmentType('FORWARD_CONTRACT');
}
