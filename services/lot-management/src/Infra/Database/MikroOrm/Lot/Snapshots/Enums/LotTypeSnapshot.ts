import { EnumSnapshot } from '@shared/db';

import { LotType } from '../../../../../../Domain';

export type LotTypeSnapshot = EnumSnapshot<LotType>;
export const LotTypeSnapshot = EnumSnapshot(LotType);
