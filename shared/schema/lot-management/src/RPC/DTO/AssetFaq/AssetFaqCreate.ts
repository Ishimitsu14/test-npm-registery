import { AssetFaq } from '../../../Resource';

export namespace AssetFaqCreate {
  export type Payload = {
    asset: string;
    question: string;
    answer: string;
  };
  export type Result = AssetFaq;
}
