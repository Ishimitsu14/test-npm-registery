import { LotQuestion } from '../../../Resource';

export namespace LotQuestionCreate {
  export type Payload = {
    lot: number;
    text: string;
    parentLotQuestion: string;
  };
  export type Result = LotQuestion;
}
