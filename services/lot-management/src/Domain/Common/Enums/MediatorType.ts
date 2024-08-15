import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class MediatorType extends Enumeration<LotManagementSchema.MediatorType> {
  static DIRECT = new MediatorType('DIRECT');
  static MARKETPLACE = new MediatorType('MARKETPLACE');
  static OTC_AGENT = new MediatorType('OTC_AGENT');
}
