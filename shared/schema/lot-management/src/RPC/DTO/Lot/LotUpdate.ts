import { LotInputObject, LotKey, LotType, OfferMakerKey } from '../../../Resource';

export namespace LotUpdate {
  export type Payload = {
    id: LotKey['id'];

    type?: LotType;
    offerMaker?: OfferMakerKey['userId'];
    inputs?: LotInputObject;
  };

  export type Result = void;
}
