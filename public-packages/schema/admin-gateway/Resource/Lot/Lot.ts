import { CoreSchema } from '../../../core';
import { UserKey } from '../User';
import { LotAttributesObject } from './Attributes';
import { LotStatus, LotType } from './Enums';
import { LotKey } from './LotKey';

export interface Lot extends CoreSchema.Resource<'lot', LotKey> {
  offerMaker: UserKey;
  status: LotStatus;
  type: LotType;

  // Stats
  score: number;
  isHot: boolean;

  // Attributes
  attributes: LotAttributesObject;
}
