import { DealKey } from '../../../Resource';

export namespace DealComplete {
  export type Payload = {
    id: DealKey['id'];
  };
  export type Result = void;
}
