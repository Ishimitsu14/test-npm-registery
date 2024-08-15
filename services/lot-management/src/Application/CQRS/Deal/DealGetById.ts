import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { DealNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';
import { DealPK } from 'services/lot-management/src/Domain';

import { BID_REPOSITORY_INJECT_TOKEN, DEAL_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { CommonResourceMapper, DealResourceMapper } from '../../ResourceMappers';

export type DealGetByIdProps = LotManagementSchema.RPC.DTO.DealGetById.Payload;
export type DealGetByIdResult = LotManagementSchema.RPC.DTO.DealGetById.Result;

export class DealGetById implements UseCase<DealGetByIdProps, DealGetByIdResult> {
  @Inject(CommonResourceMapper)
  private commonResourceMapper: CommonResourceMapper;

  @Inject(DealResourceMapper)
  private dealResourceMapper: DealResourceMapper;

  @InjectContext(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: InjectContext<DEAL_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: DealGetByIdProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
    });
  }

  async execute(payload: DealGetByIdProps): Promise<DealGetByIdResult> {
    const dealRepository = await this.dealRepository();
    const bidRepository = await this.bidRepository();
    const lotRepository = await this.lotRepository();

    const dealPK = DealPK.raw(payload.id);
    const deal = await dealRepository.get(dealPK);
    if (NullableObject.isEmpty(deal)) throw new DealNotFoundError(payload.id);

    // const bid = await bidRepository.get(deal.bidPK);
    // const lot = NullableObject.hasValue(bid) ? await lotRepository.get(bid.lotPK) : NullableObject;

    return this.dealResourceMapper.toDeal(deal);
  }
}
