import { LotKey } from '../../../Resource';

export namespace LotCancelModeration {
  export type Payload = {
    id: LotKey['id'];
  };

  export type Result = void;
}
