import { EnumSnapshot } from '@shared/db';

import { InvestRound } from '../../../../../Domain';

export type InvestRoundSnapshot = EnumSnapshot<InvestRound>;
export const InvestRoundSnapshot = EnumSnapshot(InvestRound);
