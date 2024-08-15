import { EnumSnapshot } from '@shared/db';

import { KeyResultStatus } from '../../../../../../Domain';

export type KeyResultStatusSnapshot = EnumSnapshot<KeyResultStatus>;
export const KeyResultStatusSnapshot = EnumSnapshot(KeyResultStatus);
