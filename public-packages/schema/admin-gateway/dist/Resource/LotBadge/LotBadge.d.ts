import { CoreSchema } from '@schema/core';
import { LotBadgeKey } from './LotBadgePK';
export interface LotBadge extends CoreSchema.Resource<'lot_badge', LotBadgeKey> {
    sort: number;
    createdAt: number;
}
