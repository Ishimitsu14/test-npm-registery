import { EnumSnapshot } from '@shared/db';

import { BidStatus } from '../../../../../../Domain';

export type BidStatusSnapshot = EnumSnapshot<BidStatus>;
export const BidStatusSnapshot = EnumSnapshot(BidStatus);
