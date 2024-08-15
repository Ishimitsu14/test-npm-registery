import { Lot, LotKey } from '../../../Resource';

export namespace LotSendOnModeration {
  export type Payload = {
    id: LotKey['id'];
  };
  export type Result = Lot;
}
