import { LotQuestionKey } from '../../../Resource';

export namespace LotQuestionApprove {
  export type Payload = {
    id: LotQuestionKey['id'];
  };
  export type Result = void;
}
