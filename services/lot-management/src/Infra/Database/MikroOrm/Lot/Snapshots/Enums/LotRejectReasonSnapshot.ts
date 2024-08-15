import { EnumSnapshot } from '@shared/db';

import { LotRejectReason } from '../../../../../../Domain';

export type LotRejectReasonSnapshot = EnumSnapshot<LotRejectReason>;
export const LotRejectReasonSnapshot = EnumSnapshot(LotRejectReason);
