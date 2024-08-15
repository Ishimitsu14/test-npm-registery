import { EnumSnapshot } from '@shared/db';

import { InvestorType } from '../../../../../Domain';

export type InvestorTypeSnapshot = EnumSnapshot<InvestorType>;
export const InvestorTypeSnapshot = EnumSnapshot(InvestorType);
