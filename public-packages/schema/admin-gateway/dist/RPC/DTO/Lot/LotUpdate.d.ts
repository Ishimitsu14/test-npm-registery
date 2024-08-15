import { Lot, LotInputObject, LotKey, LotType, UserKey } from '../../../Resource';
export type LotUpdatePayload = {
    id: LotKey['id'];
    offerMaker?: UserKey['id'];
    type?: LotType;
    inputs?: LotInputObject;
};
export type LotUpdateResult = Lot;
