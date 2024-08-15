import { AssetKey } from '../../../Resource';

export namespace AssetMakeActive {
  export type Payload = {
    id: AssetKey['id'];
  };
  export type Result = void;
}
