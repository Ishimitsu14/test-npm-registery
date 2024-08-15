import { forwardRef, Inject } from '@nestjs/common';
import { CoreSchema } from '@schema/core';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { useAuthApi } from '../Contexts';
import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { BidResourceMapper, CoreResourceMapper } from '../ResourceMapper';
import { LotService } from './LotService';
import { UserService } from './UserService';

export class BidService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private lotManagementRpc: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(forwardRef(() => BidResourceMapper))
  private bidResourceMapper: BidResourceMapper;

  @Inject(CoreResourceMapper)
  private coreResourceMapper: CoreResourceMapper;

  @Inject(forwardRef(() => LotService))
  private lotService: LotService;

  @Inject(forwardRef(() => UserService))
  private userService: UserService;

  get onlyMyBidsFilter(): LotManagementSchema.RPC.DTO.BidList.Filter {
    const { userId, isAuthorized } = useAuthApi();
    return (
      isAuthorized && {
        bidMaker: [userId],
      }
    );
  }

  get otherInStatusFilter(): LotManagementSchema.RPC.DTO.BidList.Filter {
    return {
      status: ['ACTIVE', 'DEAL'],
    };
  }

  async create(payload: DeskGatewaySchema.BidCreatePayload): Promise<DeskGatewaySchema.BidCreateResult> {
    const { userId } = useAuthApi();

    const bidKey = await this.lotManagementRpc.send('bid.create', {
      lot: payload.lotId,
      bidMaker: userId,
      bidMakerType: payload.bidMakerType,
      location: payload.location,
      readyForVerification: payload.readyForVerification,
      telegram: payload.telegram,
      isDirect: payload.isDirect,
      deadline: payload.deadline,

      summary: payload.summary,
      units: payload.units,
      price: payload.price,
      fdv: payload.fdv,
    });

    const bid = await this.lotManagementRpc.send('bid.getById', { id: bidKey.id });
    return this.fetch(bid);
  }

  async list(payload: DeskGatewaySchema.BidListPayload): Promise<DeskGatewaySchema.BidListResult> {
    const filter = { AND: [{ OR: [this.onlyMyBidsFilter, this.otherInStatusFilter] }, this.toFilter(payload.filter)] };
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRpc.send('bid.list', {
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

  async accept(payload: DeskGatewaySchema.BidAcceptPayload): Promise<DeskGatewaySchema.BidAcceptResult> {
    const { userId } = useAuthApi();

    await this.lotManagementRpc.send('bid.accept', { id: payload.id, userId });

    const bid = await this.lotManagementRpc.send('bid.getById', { id: payload.id });
    return this.fetch(bid);
  }

  async reject(payload: DeskGatewaySchema.BidRejectPayload): Promise<DeskGatewaySchema.BidRejectResult> {
    await this.lotManagementRpc.send('bid.reject', { id: payload.id, reason: 'OFFER_MAKER_REJECT' });

    const bid = await this.lotManagementRpc.send('bid.getById', { id: payload.id });
    return this.fetch(bid);
  }

  async fetch(item: LotManagementSchema.Bid) {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.Bid[]) {
    return items.map((m) => this.bidResourceMapper.toBid(m));
  }

  toFilter(filter: DeskGatewaySchema.BidListFilter): LotManagementSchema.RPC.DTO.BidList.Filter {
    const { userId, ensureIsAuthorized } = useAuthApi();

    return compositeFilterGateway(filter, (filter) => {
      if (filter.onlyMy) ensureIsAuthorized();

      return {
        id: filter.id,

        status: filter.status,
        bidMaker: filter.onlyMy ? [userId] : undefined,

        lot: this.lotService.toFilter(filter.lot),
      };
    });
  }

  toInclude(include: boolean | DeskGatewaySchema.BidListInclude): LotManagementSchema.RPC.DTO.BidList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {
      lot: this.lotService.toInclude(include?.lot),
    };
  }

  toInternalIncludeLinks(items: LotManagementSchema.Bid[], include: boolean | DeskGatewaySchema.BidListInclude) {
    return includeLinks(include, async (include, links) => {
      if (include.bidMaker) {
        const userIds = items.map((m) => m.bidMakerKey.userId);
        const users = userIds.length > 0 ? await this.userIdentityRPC.send('user.list', { filter: { id: userIds } }).then((m) => m.items) : [];
        const userResult = await this.userService.fetchMany(users);

        links.push(...userResult);
      }
    });
  }

  async toExternalIncludeLinks(
    links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.BidList.Include>[],
    include: boolean | DeskGatewaySchema.BidListInclude,
  ): Promise<CoreSchema.IncludeLink<DeskGatewaySchema.BidListInclude>[]> {
    const externalLinks: CoreSchema.IncludeLink<DeskGatewaySchema.BidListInclude>[] = [];

    const lotLinks = links.filter((m) => m.resource === 'lot') as LotManagementSchema.Lot[];

    const lots = await this.lotService.fetchMany(lotLinks);
    externalLinks.push(...lots);

    if (typeof include !== 'boolean' && include) {
      const lotExternalLinks = await this.lotService.toExternalIncludeLinks(<CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.LotList.Include>[]>links, include.lot);
      externalLinks.push(...lotExternalLinks);

      const lotInternalLinks = await this.lotService.toInternalIncludeLinks(lotLinks, include.lot);
      externalLinks.push(...lotInternalLinks);
    }

    return externalLinks;
  }
}
