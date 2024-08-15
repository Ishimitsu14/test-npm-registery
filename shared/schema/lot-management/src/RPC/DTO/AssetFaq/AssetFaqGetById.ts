import { AssetFaq } from '../../../Resource';

export namespace AssetFaqGetById {
  export type Payload = {
    id: string;
  };
  export type Result = AssetFaq;
}
