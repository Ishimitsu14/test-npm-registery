import { EnumSnapshot } from '@shared/db';

import { DealTransactionStatus } from '../../../../../../Domain';

export type DealTransactionStatusSnapshot = EnumSnapshot<DealTransactionStatus>;
export const DealTransactionStatusSnapshot = EnumSnapshot(DealTransactionStatus);
