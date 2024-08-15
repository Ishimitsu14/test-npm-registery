import { CoreSchema } from '../../../core';
import { LotKey } from '../Lot';
import { UserKey } from '../User';
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
