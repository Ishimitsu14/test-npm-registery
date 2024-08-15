import { Inject } from '@nestjs/common';
import { LotManagementSchema } from '@schema/lot-management';
import { SeedUtils } from '@shared/db';

import { LotBadgeCreate, LotBadgeList } from '../../Application';

export class LotBadgeSeed {
  @Inject(LotBadgeCreate)
  private lotBadgeCreate: LotBadgeCreate;

  @Inject(LotBadgeList)
  private lotBadgeList: LotBadgeList;

  @Inject(SeedUtils)
  private seedUtils: SeedUtils;

  async createDemo() {
    const badges = [
      {
        id: 'VIP',
        sort: 1,
      },
      {
        id: 'Promo',
        sort: 2,
      },
      {
        id: 'HOT',
        sort: 3,
      },
    ];

    const list = await this.seedUtils.newRequest('lotBadge.list', async () => {
      await this.lotBadgeList.validate({});
      return await this.lotBadgeList.execute({});
    });

    const restItems = badges.filter((badge) => !list.items.some((item) => item.id === badge.id));

    await this.createMany(restItems);
  }

  async createMany(props: LotManagementSchema.RPC.DTO.LotBadgeCreate.Payload[]) {
    await Promise.all(props.map((props) => this.create(props)));
  }

  async create(props: LotManagementSchema.RPC.DTO.LotBadgeCreate.Payload) {
    return this.seedUtils.newRequest('lotBadge.create', async () => {
      await this.lotBadgeCreate.validate(props);
      return await this.lotBadgeCreate.execute(props);
    });
  }
}
