import LINQ from '@berish/linq';
import { forwardRef, Inject } from '@nestjs/common';
import { CoreSchema } from '@schema/core';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { useAuthApi } from '../Contexts';
import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { CoreResourceMapper, DealResourceMapper } from '../ResourceMapper';
import { BidService } from './BidService';
import { UserService } from './UserService';

export class DealService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private lotManagementRpc: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(forwardRef(() => DealResourceMapper))
  private dealResourceMapper: DealResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  @Inject(forwardRef(() => UserService))
  private userService: UserService;

  @Inject(forwardRef(() => BidService))
  private bidService: BidService;

  get offerMakerFilter(): LotManagementSchema.RPC.DTO.DealList.Filter {
    const { userId } = useAuthApi();

    return {
      offerMaker: [userId],
    };
  }

  get bidMakerFilter(): LotManagementSchema.RPC.DTO.DealList.Filter {
    const { userId } = useAuthApi();

    return {
      bidMaker: [userId],
    };
  }

  async getById(payload: DeskGatewaySchema.DealGetByIdPayload): Promise<DeskGatewaySchema.DealGetByIdResult> {
    const deal = await this.lotManagementRpc.send('deal.getById', {
      id: payload.id,
    });

    return this.fetch(deal);
  }

  async list(payload: DeskGatewaySchema.RPC.DTO.DealList.Payload): Promise<DeskGatewaySchema.RPC.DTO.DealList.Result> {
    const filter = {
      AND: [{ OR: [this.offerMakerFilter, this.bidMakerFilter] }, this.toFilter(payload.filter)],
    };
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRpc.send('deal.list', {
      filter,
      include,
      page: payload.page,
    });

    const internalLinks = await this.toInternalIncludeLinks(items, payload.include);
    const externalLinks = await this.toExternalIncludeLinks(links, payload.include);

    return {
      total,
      links: internalLinks.concat(externalLinks),
      items: await this.fetchMany(items),
    };
  }

  async fetch(item: LotManagementSchema.Deal) {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.Deal[]) {
    return items.map((m) => this.dealResourceMapper.toDeal(m));
  }

  toFilter(filter: DeskGatewaySchema.RPC.DTO.DealList.Filter): LotManagementSchema.RPC.DTO.DealList.Filter {
    return compositeFilterGateway(filter, (filter) => ({
      id: filter.id,

      status: filter.status,
      offerMaker: filter.offerMaker,
      bidMaker: filter.bidMaker,

      bid: this.bidService.toFilter(filter.bid),
    }));
  }

  toInclude(include: boolean | DeskGatewaySchema.RPC.DTO.DealList.Include): LotManagementSchema.RPC.DTO.DealList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {
      bid: this.bidService.toInclude(include?.bid),
    };
  }

  toInternalIncludeLinks(items: LotManagementSchema.Deal[], include: boolean | DeskGatewaySchema.RPC.DTO.DealList.Include) {
    return includeLinks(include, async (include, links) => {
      if (include.bidMaker) {
        const userIds = LINQ.from(items)
          .selectMany((m) => m.bidMakers)
          .map((m) => m.userId);
        const users = userIds.length > 0 ? await this.userIdentityRPC.send('user.list', { filter: { id: userIds } }).then((m) => m.items) : [];
        const userResult = await this.userService.fetchMany(users);
        links.push(...userResult);
      }

      if (include.offerMaker) {
        const userIds = LINQ.from(items)
          .selectMany((m) => m.offerMakers)
          .map((m) => m.userId);
        const users = userIds.length > 0 ? await this.userIdentityRPC.send('user.list', { filter: { id: userIds } }).then((m) => m.items) : [];
        const userResult = await this.userService.fetchMany(users);
        links.push(...userResult);
      }
    });
  }

  async toExternalIncludeLinks(
    links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.DealList.Include>[],
    include: boolean | DeskGatewaySchema.RPC.DTO.DealList.Include,
  ): Promise<CoreSchema.IncludeLink<DeskGatewaySchema.RPC.DTO.DealList.Include>[]> {
    const externalLinks: CoreSchema.IncludeLink<DeskGatewaySchema.RPC.DTO.DealList.Include>[] = [];

    const bids = await this.bidService.fetchMany(<LotManagementSchema.Bid[]>links.filter((m) => m.resource === 'bid'));
    externalLinks.push(...bids);

    const bidInclude = typeof include === 'boolean' || !include ? false : include.bid;

    const bidLinks = await this.bidService.toExternalIncludeLinks(<CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.BidList.Include>[]>links, bidInclude);
    externalLinks.push(...bidLinks);

    return externalLinks;
  }
}
