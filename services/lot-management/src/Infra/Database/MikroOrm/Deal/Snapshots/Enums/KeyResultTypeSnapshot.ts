import { EnumerationID } from '@ddd/domain';
import { EnumSnapshot } from '@shared/db';

import { KeyResultType } from '../../../../../../Domain';

export type KeyResultTypeSnapshot = EnumerationID<KeyResultType>;
export const KeyResultTypeSnapshot = EnumSnapshot(KeyResultType);
