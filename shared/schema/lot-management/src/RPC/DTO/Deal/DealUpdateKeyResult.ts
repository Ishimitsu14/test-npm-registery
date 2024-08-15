import { DealKey, DealKeyUpdates } from '../../../Resource';

export namespace DealUpdateKeyResult {
  export type Payload = {
    id: DealKey['id'];
  } & DealKeyUpdates;

  export type Result = void;
}
