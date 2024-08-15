import { LotManagementSchema } from '@schema/lot-management';

import { LotBadge, LotBadgePK } from '../../Domain';

export class LotBadgeResourceMapper {
  toLotBadgeKey(pk: LotBadgePK): Required<LotManagementSchema.LotBadgeKey> {
    return {
      resource: 'lot_badge_key',
      id: pk.id,
    };
  }

  toLotBadge(lotBadge: LotBadge): Required<LotManagementSchema.LotBadge> {
    return {
      resource: 'lot_badge',
      id: lotBadge.primaryKey.id,
      sort: lotBadge.sort,
      createdAt: +lotBadge.createdAt,
    };
  }
}
