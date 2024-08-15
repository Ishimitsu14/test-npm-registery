import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { BidNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { BidPK } from '../../../Domain';
import { BID_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type BidAcceptProps = LotManagementSchema.RPC.DTO.BidAccept.Payload;
export type BidAcceptResult = LotManagementSchema.RPC.DTO.BidAccept.Result;

export class BidAccept implements UseCase<BidAcceptProps, BidAcceptResult> {
  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  async validate(payload: BidAcceptProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
      userId: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: BidAcceptProps): Promise<BidAcceptResult> {
    const uow = await this.uow();
    const bidRepository = await this.bidRepository();

    const bid = await bidRepository.get(BidPK.create(payload.id));
    if (NullableObject.isEmpty(bid)) throw new BidNotFoundError(payload.id);

    bid.accept();
    bidRepository.update(bid);

    await uow.commit();
  }
}
