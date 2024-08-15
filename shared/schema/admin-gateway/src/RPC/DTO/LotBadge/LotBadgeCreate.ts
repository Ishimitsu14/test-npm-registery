import { LotBadge } from '../../../Resource';

export namespace LotBadgeCreate {
  export type Payload = {
    id: string;
    sort: number;
  };

  export type Result = LotBadge;
}

export type LotBadgeCreatePayload = {
    id: string;
    sort: number;
  };
export type LotBadgeCreateResult = LotBadge;
