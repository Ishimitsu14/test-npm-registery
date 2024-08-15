import { Lot } from '../../../Resource';

export namespace LotGetById {
  export type Payload = { id: number };
  export type Result = Lot;
}
