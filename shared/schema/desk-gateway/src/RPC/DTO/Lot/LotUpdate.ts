import { Lot, LotInputObject, LotKey, LotType } from '../../../Resource';

export namespace LotUpdate {
  export type Payload = {
    id: LotKey['id'];

    type?: LotType;
    inputs?: LotInputObject;
  };
  export type Result = Lot;
}
