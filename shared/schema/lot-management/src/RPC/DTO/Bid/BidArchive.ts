import { BidKey } from '../../../Resource';

export namespace BidArchive {
  export type Payload = {
    id: BidKey['id'];
  };
  export type Result = void;
}
