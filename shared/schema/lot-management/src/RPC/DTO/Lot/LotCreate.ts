import { LotInputObject, LotKey, LotType, OfferMakerKey } from '../../../Resource';

export namespace LotCreate {
  export type Payload = {
    type: LotType;
    offerMaker: OfferMakerKey['userId'];

    inputs?: LotInputObject;
  };

  export type Result = LotKey;
}
