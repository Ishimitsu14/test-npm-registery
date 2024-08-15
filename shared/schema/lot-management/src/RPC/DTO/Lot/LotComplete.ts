import { LotCompletedReasonType } from '../../../Resource';

export namespace LotComplete {
  export type Payload = {
    id: number;
    reason: LotCompletedReasonType;
  };

  export type Result = void;
}
