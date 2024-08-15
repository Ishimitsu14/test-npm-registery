import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class AssetLinkGroup extends Enumeration<LotManagementSchema.AssetLinkGroup> {
  static OFFICIAL = new AssetLinkGroup('OFFICIAL');
  static SOCIAL = new AssetLinkGroup('SOCIAL');
  static OTHER = new AssetLinkGroup('OTHER');
}
