import { CoreSchema } from '@schema/core';

import { OfferMakerKey } from '../Actors';
import { LotAttributesObject } from './Attributes';
import { LotStatus, LotType } from './Enums';
import { LotKey } from './LotKey';

export interface Lot extends CoreSchema.Resource<'lot', LotKey> {
  offerMaker: OfferMakerKey;
  status: LotStatus;
  type: LotType;

  // Stats
  score: number;
  isHot: boolean;

  // Attributes
  attributes: LotAttributesObject;
}
