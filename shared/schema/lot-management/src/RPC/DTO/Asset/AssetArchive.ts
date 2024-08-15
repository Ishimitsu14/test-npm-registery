import { AssetKey } from '../../../Resource';

export namespace AssetArchive {
  export type Payload = {
    id: AssetKey['id'];
  };
  export type Result = void;
}
