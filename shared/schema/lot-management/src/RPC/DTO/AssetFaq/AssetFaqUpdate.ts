export namespace AssetFaqUpdate {
  export type Payload = {
    id: string;
    asset: string;
    question: string;
    answer: string;
  };
  export type Result = void;
}
