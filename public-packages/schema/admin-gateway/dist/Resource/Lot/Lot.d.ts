import { CoreSchema } from '@schema/core';
import { UserKey } from '../User';
import { LotAttributesObject } from './Attributes';
import { LotStatus, LotType } from './Enums';
import { LotKey } from './LotKey';
export interface Lot extends CoreSchema.Resource<'lot', LotKey> {
    offerMaker: UserKey;
    status: LotStatus;
    type: LotType;
    score: number;
    isHot: boolean;
    attributes: LotAttributesObject;
}
