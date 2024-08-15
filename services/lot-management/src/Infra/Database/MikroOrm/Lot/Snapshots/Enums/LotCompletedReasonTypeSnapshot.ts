import { EnumSnapshot } from '@shared/db';

import { LotCompletedReasonType } from '../../../../../../Domain';

export type LotCompletedReasonTypeSnapshot = EnumSnapshot<LotCompletedReasonType>;
export const LotCompletedReasonTypeSnapshot = EnumSnapshot(LotCompletedReasonType);
