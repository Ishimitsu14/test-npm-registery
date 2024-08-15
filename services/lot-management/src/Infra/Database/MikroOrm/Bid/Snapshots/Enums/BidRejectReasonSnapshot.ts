import { EnumSnapshot } from '@shared/db';

import { BidRejectReason } from '../../../../../../Domain';

export type BidRejectReasonSnapshot = EnumSnapshot<BidRejectReason>;
export const BidRejectReasonSnapshot = EnumSnapshot(BidRejectReason);
