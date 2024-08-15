import { LotKey } from '../../../Resource';

export namespace LotReject {
  export type Payload = {
    id: LotKey['id'];
  };

  export type Result = void;
}
