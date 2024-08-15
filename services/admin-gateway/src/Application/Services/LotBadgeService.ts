import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { LotBadgeResourceMapper } from '../ResourceMapper';

export class LotBadgeService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private readonly lotManagementRPC: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(LotBadgeResourceMapper)
  private lotBadgeResourceMapper: LotBadgeResourceMapper;

  async create(payload: AdminGatewaySchema.LotBadgeCreatePayload): Promise<AdminGatewaySchema.LotBadgeCreateResult> {
    const lotBadge = await this.lotManagementRPC.send('lotBadge.create', {
      id: payload.id,
      sort: payload.sort,
    });

    return this.fetch(lotBadge);
  }

  async list(payload: AdminGatewaySchema.LotBadgeListPayload): Promise<AdminGatewaySchema.LotBadgeListResult> {
    const filter = this.toFilter(payload.filter);
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRPC.send('lotBadge.list', {
      page: payload.page,
      filter,
      include,
      sort: payload.sort,
    });

    const internalLinks = await this.toInternalIncludeLinks(items, payload.include);
    const externalLinks = await this.toExternalIncludeLinks(links);

    return {
      total,
      items: await this.fetchMany(items),
      links: internalLinks.concat(externalLinks),
    };
  }

  async fetch(item: LotManagementSchema.LotBadge): Promise<AdminGatewaySchema.LotBadge> {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.LotBadge[]): Promise<AdminGatewaySchema.LotBadge[]> {
    return items.map((item) => this.lotBadgeResourceMapper.toLotBadge(item));
  }

  toFilter(filter: AdminGatewaySchema.LotBadgeListFilter): LotManagementSchema.RPC.DTO.LotBadgeList.Filter {
    return compositeFilterGateway(filter, (filter) => {
      return {
        id: filter.id,
      };
    });
  }

  toInclude(include: boolean | AdminGatewaySchema.LotBadgeListInclude): LotManagementSchema.RPC.DTO.LotBadgeList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {};
  }

  toInternalIncludeLinks(items: LotManagementSchema.LotBadge[], include: boolean | AdminGatewaySchema.LotBadgeListInclude) {
    return includeLinks(include, async (include, links) => {});
  }

  async toExternalIncludeLinks(links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.LotBadgeList.Include>[]): Promise<CoreSchema.IncludeLink<AdminGatewaySchema.LotBadgeListInclude>[]> {
    return [];
  }
}
