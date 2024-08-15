import { Asset } from '../../../Resource';

export namespace AssetGetById {
  export type Payload = {
    id: string;
  };
  export type Result = Asset;
}
