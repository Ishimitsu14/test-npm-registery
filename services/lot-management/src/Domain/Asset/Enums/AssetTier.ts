import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class AssetTier extends Enumeration<LotManagementSchema.AssetTier> {
  static TIER_1 = new AssetTier('TIER_1');
  static TIER_2 = new AssetTier('TIER_2');
  static TIER_3 = new AssetTier('TIER_3');
  static TIER_4 = new AssetTier('TIER_4');
}
