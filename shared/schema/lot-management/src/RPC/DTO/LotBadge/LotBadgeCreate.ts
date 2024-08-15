import { LotBadge } from '../../../Resource';

export namespace LotBadgeCreate {
  export type Payload = {
    id: string;
    sort: number;
  };

  export type Result = LotBadge;
}
