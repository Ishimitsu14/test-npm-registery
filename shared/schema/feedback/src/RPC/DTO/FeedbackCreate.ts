import { FeedbackPK } from '../../Resource';

export namespace FeedbackCreate {
  export type Payload = {
    text: string;
    page: string;
    rating: number;
    userPk: string;
  };

  export type Result = FeedbackPK;
}
