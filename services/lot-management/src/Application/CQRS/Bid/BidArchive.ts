import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { BidNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';

import { BidPK } from '../../../Domain';
import { BID_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type BidArchiveProps = LotManagementSchema.RPC.DTO.BidArchive.Payload;
export type BidArchiveResult = LotManagementSchema.RPC.DTO.BidArchive.Result;

export class BidArchive implements UseCase<BidArchiveProps, BidArchiveResult> {
  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  async validate(payload: BidArchiveProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isNumberSchema],
    });
  }

  async execute(payload: BidArchiveProps): Promise<BidArchiveResult> {
    const uow = await this.uow();
    const bidRepository = await this.bidRepository();

    const bid = await bidRepository.get(BidPK.create(payload.id));
    if (NullableObject.isEmpty(bid)) throw new BidNotFoundError(payload.id);

    bid.archive();
    bidRepository.update(bid);

    await uow.commit();
  }
}
