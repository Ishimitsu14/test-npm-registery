import { EnumSnapshot } from '@shared/db';

import { AssetStatus } from '../../../../../../Domain';

export type AssetStatusSnapshot = EnumSnapshot<AssetStatus>;
export const AssetStatusSnapshot = EnumSnapshot(AssetStatus);
