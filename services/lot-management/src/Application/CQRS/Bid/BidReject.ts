import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { BidNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isEnumSchema, isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';

import { BidPK, BidRejectReason } from '../../../Domain';
import { BID_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type BidRejectProps = LotManagementSchema.RPC.DTO.BidReject.Payload;
export type BidRejectResult = LotManagementSchema.RPC.DTO.BidReject.Result;

export class BidReject implements UseCase<BidRejectProps, BidRejectResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: BidRejectProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
      reason: [isRequiredSchema, isEnumSchema(BidRejectReason.getAllIds())],
    });
  }

  async execute(payload: BidRejectProps): Promise<BidRejectResult> {
    const uow = await this.uow();
    const bidRepository = await this.bidRepository();

    const bid = await bidRepository.get(BidPK.create(payload.id));
    if (NullableObject.isEmpty(bid)) throw new BidNotFoundError(payload.id);

    bid.reject(BidRejectReason.getById(payload.reason));
    bidRepository.update(bid);

    await uow.commit();
  }
}
