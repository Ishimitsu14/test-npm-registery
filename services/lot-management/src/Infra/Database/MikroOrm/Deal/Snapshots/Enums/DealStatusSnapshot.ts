import { EnumSnapshot } from '@shared/db';

import { DealStatus } from '../../../../../../Domain';

export type DealStatusSnapshot = EnumSnapshot<DealStatus>;
export const DealStatusSnapshot = EnumSnapshot(DealStatus);
