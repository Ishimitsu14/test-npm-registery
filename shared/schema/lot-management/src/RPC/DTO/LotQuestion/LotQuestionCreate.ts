import { LotQuestion } from '../../../Resource';

export namespace LotQuestionCreate {
  export type Payload = {
    user: string;
    lot: number;
    text: string;
    parentLotQuestion?: string;
  };
  export type Result = LotQuestion;
}
