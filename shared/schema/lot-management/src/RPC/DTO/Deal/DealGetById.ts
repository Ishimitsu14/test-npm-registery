import { Deal, DealKey } from '../../../Resource';

export namespace DealGetById {
  export type Payload = {
    id: DealKey['id'];
  };
  export type Result = Deal;
}
