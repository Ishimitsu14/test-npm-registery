import { forwardRef, Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { CoreSchema } from '@schema/core';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { useAuthApi } from '../Contexts';
import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { BidResourceMapper } from '../ResourceMapper';
import { LotService } from './LotService';
import { UserService } from './UserService';

export class BidService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private lotManagementRpc: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(BidResourceMapper)
  private bidResourceMapper: BidResourceMapper;

  @Inject(forwardRef(() => LotService))
  private lotService: LotService;

  @Inject(forwardRef(() => UserService))
  private userService: UserService;

  async list(payload: AdminGatewaySchema.BidListPayload): Promise<AdminGatewaySchema.BidListResult> {
    const filter = this.toFilter(payload.filter);
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRpc.send('bid.list', {
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

  async getById(payload: AdminGatewaySchema.BidGetByIdPayload): Promise<AdminGatewaySchema.BidGetByIdResult> {
    const bid = await this.lotManagementRpc.send('bid.getById', { id: payload.id });

    return this.fetch(bid);
  }

  async makeActive(payload: AdminGatewaySchema.BidMakeActivePayload): Promise<AdminGatewaySchema.BidMakeActiveResult> {
    await this.lotManagementRpc.send('bid.makeActive', {
      id: payload.id,
    });

    const bid = await this.lotManagementRpc.send('bid.getById', { id: payload.id });
    return this.fetch(bid);
  }

  async archive(payload: AdminGatewaySchema.BidArchivePayload): Promise<AdminGatewaySchema.BidArchiveResult> {
    await this.lotManagementRpc.send('bid.archive', payload);

    const bid = await this.lotManagementRpc.send('bid.getById', { id: payload.id });
    return this.fetch(bid);
  }

  async update(payload: AdminGatewaySchema.BidUpdatePayload): Promise<AdminGatewaySchema.BidUpdateResult> {
    await this.lotManagementRpc.send('bid.update', payload);

    const bid = await this.lotManagementRpc.send('bid.getById', { id: payload.id });
    return this.fetch(bid);
  }

  async reject(payload: AdminGatewaySchema.BidRejectPayload): Promise<AdminGatewaySchema.BidRejectResult> {
    await this.lotManagementRpc.send('bid.reject', {
      id: payload.id,
      reason: payload.reason,
    });

    const bid = await this.lotManagementRpc.send('bid.getById', { id: payload.id });
    return this.fetch(bid);
  }

  async fetch(item: LotManagementSchema.Bid) {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.Bid[]) {
    return items.map((m) => this.bidResourceMapper.toBid(m));
  }

  toFilter(filter: AdminGatewaySchema.BidListFilter): LotManagementSchema.RPC.DTO.BidList.Filter {
    const { userId, ensureIsAuthorized } = useAuthApi();

    return compositeFilterGateway(filter, (filter) => {
      if (filter.onlyMy) ensureIsAuthorized();

      return {
        id: filter.id,

        status: filter.status,
        bidMaker: filter.onlyMy ? [userId] : filter.bidMaker,

        lot: this.lotService.toFilter(filter.lot),
      };
    });
  }

  toInclude(include: boolean | AdminGatewaySchema.BidListInclude): LotManagementSchema.RPC.DTO.BidList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {
      lot: this.lotService.toInclude(include?.lot),
    };
  }

  toInternalIncludeLinks(items: LotManagementSchema.Bid[], include: boolean | AdminGatewaySchema.BidListInclude) {
    return includeLinks(include, async (include, links) => {
      if (include.bidMaker) {
        const userIds = items.map((m) => m.bidMakerKey.userId);
        const users = userIds.length > 0 ? await this.userIdentityRPC.send('user.list', { filter: { id: userIds } }).then((m) => m.items) : [];
        const userResult = await this.userService.fetchMany(users);

        links.push(...userResult);
      }
    });
  }

  async toExternalIncludeLinks(links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.BidList.Include>[]): Promise<CoreSchema.IncludeLink<AdminGatewaySchema.BidListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<AdminGatewaySchema.BidListInclude>[] = [];

    const lots = await this.lotService.fetchMany(<LotManagementSchema.Lot[]>links.filter((m) => m.resource === 'lot'));
    externalLinks.push(...lots);

    const lotLinks = await this.lotService.toExternalIncludeLinks(<CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.LotList.Include>[]>links);
    externalLinks.push(...lotLinks);

    return externalLinks;
  }
}
