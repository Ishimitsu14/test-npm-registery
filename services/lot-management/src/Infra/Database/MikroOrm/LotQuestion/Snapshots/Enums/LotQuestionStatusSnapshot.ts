import { EnumSnapshot } from '@shared/db';

import { LotQuestionStatus } from '../../../../../../Domain';

export type LotQuestionStatusSnapshot = EnumSnapshot<LotQuestionStatus>;
export const LotQuestionStatusSnapshot = EnumSnapshot(LotQuestionStatus);
