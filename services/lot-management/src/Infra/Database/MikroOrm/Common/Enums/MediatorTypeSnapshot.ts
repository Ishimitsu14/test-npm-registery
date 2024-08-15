import { EnumSnapshot } from '@shared/db';

import { MediatorType } from '../../../../../Domain';

export type MediatorTypeSnapshot = EnumSnapshot<MediatorType>;
export const MediatorTypeSnapshot = EnumSnapshot(MediatorType);
