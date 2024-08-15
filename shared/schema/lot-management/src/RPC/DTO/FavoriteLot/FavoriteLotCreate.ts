import { FavoriteLot } from '../../../Resource';

export namespace FavoriteLotCreate {
  export type Payload = {
    user: string;
    lot: number;
  };
  export type Result = FavoriteLot;
}
