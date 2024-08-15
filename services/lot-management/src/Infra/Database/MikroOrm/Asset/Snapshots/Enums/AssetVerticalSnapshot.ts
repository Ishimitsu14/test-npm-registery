import { EnumSnapshot } from '@shared/db';

import { AssetVertical } from '../../../../../../Domain';

export type AssetVerticalSnapshot = EnumSnapshot<AssetVertical>;
export const AssetVerticalSnapshot = EnumSnapshot(AssetVertical);
