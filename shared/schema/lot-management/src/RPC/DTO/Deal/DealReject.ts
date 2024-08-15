import { DealKey } from '../../../Resource';

export namespace DealReject {
  export type Payload = {
    id: DealKey['id'];
  };
  export type Result = void;
}
