import { LotKey } from '../../../Resource';

export namespace LotMakeActive {
  export type Payload = {
    id: LotKey['id'];
  };

  export type Result = void;
}
