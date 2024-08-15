import { CoreSchema } from '@schema/core';

import { UserKey } from '../Actors';
import { LotKey } from '../Lot';
import { LotQuestionStatus } from './Enums';
import { LotQuestionKey } from './LotQuestionPK';

export interface LotQuestion extends CoreSchema.Resource<'lot_question', LotQuestionKey> {
  userKey: UserKey;
  lotKey: LotKey;
  text: string;
  parentLotQuestion?: LotQuestionKey;
  status: LotQuestionStatus;
  createdAt: number;
}
