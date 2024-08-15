import { Feedback } from '../../Resource';

export namespace FeedbackGetById {
  export type Payload = {
    id: string;
  };

  export type Result = Feedback;
}
