import { LotQuestionKey } from '../../../Resource';

export namespace LotQuestionReject {
  export type Payload = {
    id: LotQuestionKey['id'];
  };
  export type Result = void;
}
