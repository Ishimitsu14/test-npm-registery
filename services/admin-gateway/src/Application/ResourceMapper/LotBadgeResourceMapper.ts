import { AdminGatewaySchema } from '@schema/admin-gateway';

export class LotBadgeResourceMapper {
  toLotBadgeKey(item: AdminGatewaySchema.LotBadgeKey): Required<AdminGatewaySchema.LotBadgeKey> {
    return {
      resource: 'lot_badge_key',
      id: item.id,
    };
  }

  toLotBadge(item: AdminGatewaySchema.LotBadge): Required<AdminGatewaySchema.LotBadge> {
    return {
      resource: 'lot_badge',
      id: item.id,
      sort: item.sort,
      createdAt: item.createdAt,
    };
  }
}
