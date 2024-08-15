import { EnumSnapshot } from '@shared/db';

import { AssetLinkType } from '../../../../../../Domain';

export type AssetLinkTypeSnapshot = EnumSnapshot<AssetLinkType>;
export const AssetLinkTypeSnapshot = EnumSnapshot(AssetLinkType);
