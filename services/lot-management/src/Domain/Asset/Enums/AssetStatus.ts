import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class AssetStatus extends Enumeration<LotManagementSchema.AssetStatus> {
  static ACTIVE = new AssetStatus('ACTIVE');
  static ARCHIVED = new AssetStatus('ARCHIVED');
}
