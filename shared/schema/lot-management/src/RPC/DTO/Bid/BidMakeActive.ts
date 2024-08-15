import { BidKey } from '../../../Resource';

export namespace BidMakeActive {
  export type Payload = {
    id: BidKey['id'];
  };
  export type Result = void;
}
