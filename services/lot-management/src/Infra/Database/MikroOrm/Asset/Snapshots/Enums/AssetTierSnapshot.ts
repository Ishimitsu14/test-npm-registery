import { EnumSnapshot } from '@shared/db';

import { AssetTier } from '../../../../../../Domain';

export type AssetTierSnapshot = EnumSnapshot<AssetTier>;
export const AssetTierSnapshot = EnumSnapshot(AssetTier);
