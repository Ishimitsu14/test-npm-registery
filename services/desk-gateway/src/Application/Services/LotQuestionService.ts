import { forwardRef, Inject } from '@nestjs/common';
import { CoreSchema } from '@schema/core';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';
import { compositeFilterGateway, includeLinks } from '@shared/common-internal';

import { useAuthApi } from '../Contexts';
import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { LotQuestionResourceMapper } from '../ResourceMapper';
import { UserService } from './UserService';

export class LotQuestionService {
  @Inject(LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private lotManagementRpc: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(forwardRef(() => LotQuestionResourceMapper))
  private lotQuestionResourceMapper: LotQuestionResourceMapper;

  @Inject(forwardRef(() => UserService))
  private userService: UserService;

  async create(payload: DeskGatewaySchema.RPC.DTO.LotQuestionCreate.Payload): Promise<DeskGatewaySchema.RPC.DTO.LotQuestionCreate.Result> {
    const { userId } = useAuthApi();

    const lotQuestion = await this.lotManagementRpc.send('lotQuestion.create', {
      lot: payload.lot,
      user: userId,
      parentLotQuestion: payload.parentLotQuestion,
      text: payload.text,
    });

    return lotQuestion;
  }

  async list(payload: DeskGatewaySchema.RPC.DTO.LotQuestionList.Payload): Promise<DeskGatewaySchema.RPC.DTO.LotQuestionList.Result> {
    const filter = this.toFilter(payload.filter);
    const include = this.toInclude(payload.include);

    const { items, total, links } = await this.lotManagementRpc.send('lotQuestion.list', {
      filter,
      include,
      page: payload.page,
      sort: payload.sort,
    });

    const internalLinks = await this.toInternalIncludeLinks(items, payload.include);
    const externalLinks = await this.toExternalIncludeLinks(links);

    return {
      total,
      links: internalLinks.concat(externalLinks),
      items: await this.fetchMany(items),
    };
  }

  async fetch(item: LotManagementSchema.LotQuestion) {
    return this.fetchMany([item]).then(([m]) => m);
  }

  async fetchMany(items: LotManagementSchema.LotQuestion[]) {
    return items.map((m) => this.lotQuestionResourceMapper.toLotQuestion(m));
  }

  toFilter(filter: DeskGatewaySchema.RPC.DTO.LotQuestionList.Filter): LotManagementSchema.RPC.DTO.LotQuestionList.Filter {
    return compositeFilterGateway(filter, (filter) => {
      return {
        id: filter.id,
        lot: filter.lot,
        status: filter.status,
      };
    });
  }

  toInclude(include: boolean | DeskGatewaySchema.RPC.DTO.LotQuestionList.Include): LotManagementSchema.RPC.DTO.LotQuestionList.Include {
    if (!include) return null;
    if (include === true) return {};

    return {};
  }

  toInternalIncludeLinks(items: LotManagementSchema.LotQuestion[], include: boolean | DeskGatewaySchema.RPC.DTO.LotQuestionList.Include) {
    return includeLinks(include, async (include, links) => {
      if (include.user) {
        const userIds = items.map((m) => m.userKey.id);
        const users = userIds.length > 0 ? await this.userIdentityRPC.send('user.list', { filter: { id: userIds } }).then((m) => m.items) : [];
        const userResult = await this.userService.fetchMany(users);

        links.push(...userResult);
      }
    });
  }

  async toExternalIncludeLinks(
    links: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.LotQuestionList.Include>[],
  ): Promise<CoreSchema.IncludeLink<DeskGatewaySchema.RPC.DTO.LotQuestionList.Include>[]> {
    const externalLinks: CoreSchema.IncludeLink<DeskGatewaySchema.RPC.DTO.LotQuestionList.Include>[] = [];

    return externalLinks;
  }
}
