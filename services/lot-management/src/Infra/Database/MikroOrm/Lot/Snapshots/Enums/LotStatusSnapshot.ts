import { EnumSnapshot } from '@shared/db';

import { LotStatus } from '../../../../../../Domain';

export type LotStatusSnapshot = EnumSnapshot<LotStatus>;
export const LotStatusSnapshot = EnumSnapshot(LotStatus);
