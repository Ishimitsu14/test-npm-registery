import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { BidNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';

import { BidPK } from '../../../Domain';
import { BID_REPOSITORY_INJECT_TOKEN, DEAL_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { BidResourceMapper, CommonResourceMapper } from '../../ResourceMappers';

export type BidGetByIdProps = LotManagementSchema.RPC.DTO.BidGetById.Payload;
export type BidGetByIdResult = LotManagementSchema.RPC.DTO.BidGetById.Result;

export class BidGetById implements UseCase<BidGetByIdProps, BidGetByIdResult> {
  @Inject(CommonResourceMapper)
  private commonResourceMapper: CommonResourceMapper;

  @Inject(BidResourceMapper)
  private bidResourceMapper: BidResourceMapper;

  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: InjectContext<DEAL_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: BidGetByIdProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
    });
  }

  async execute(payload: BidGetByIdProps): Promise<BidGetByIdResult> {
    const bidRepository = await this.bidRepository();

    const bidPK = BidPK.create(payload.id);

    const bid = await bidRepository.get(bidPK);
    if (NullableObject.isEmpty(bid)) throw new BidNotFoundError(payload.id);

    return this.bidResourceMapper.toBid(bid);
  }
}
