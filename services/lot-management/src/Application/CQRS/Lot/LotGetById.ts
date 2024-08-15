import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';

import { LotPK } from '../../../Domain';
import { AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { LotResourceMapper } from '../../ResourceMappers';

export type LotGetByIdProps = LotManagementSchema.RPC.DTO.LotGetById.Payload;
export type LotGetByIdResult = LotManagementSchema.RPC.DTO.LotGetById.Result;

export class LotGetById implements UseCase<LotGetByIdProps, LotGetByIdResult> {
  @Inject(AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN)
  private aggregationQueryResolver: AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: LotGetByIdProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
    });
  }

  async execute(payload: LotGetByIdProps): Promise<LotGetByIdResult> {
    const lotRepository = await this.lotRepository();

    const lotPK = new LotPK(payload.id);
    const lot = await lotRepository.get(lotPK);
    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(payload.id);

    // const [lotTotalBids, lotTransactionStats] = await this.aggregatorBus.resolveMany([new LotTotalBidsCountAggregator([lotPK]), new LotTransactionStatsAggregator([lotPK])]);

    // const totalBids = NullableObject(lotTotalBids[0], { primaryKey: lotPK, count: 0 });
    // const stats = NullableObject(lotTransactionStats[0], { primaryKey: lotPK, executed: StablecoinQuantity.ZERO, reserved: StablecoinQuantity.ZERO, available: StablecoinQuantity.ZERO });

    // const total = StablecoinQuantity.sum([stats.executed, stats.reserved, stats.available]);
    // return this.lotResourceMapper.toLot(lot, totalBids.count, stats.reserved, stats.executed, stats.available, total);
    return this.lotResourceMapper.toLot(lot);
  }
}
