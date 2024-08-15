import { EnumSnapshot } from '@shared/db';

import { LotReassignmentType } from '../../../../../../Domain';

export type LotReassignmentTypeSnapshot = EnumSnapshot<LotReassignmentType>;
export const LotReassignmentTypeSnapshot = EnumSnapshot(LotReassignmentType);
