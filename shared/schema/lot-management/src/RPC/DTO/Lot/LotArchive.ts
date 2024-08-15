import { LotKey } from '../../../Resource';

export namespace LotArchive {
  export type Payload = {
    id: LotKey['id'];
  };

  export type Result = void;
}
