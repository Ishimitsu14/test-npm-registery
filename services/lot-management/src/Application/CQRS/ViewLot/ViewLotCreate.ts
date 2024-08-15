import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';

import { LotPK, ViewLot } from '../../../Domain';
import { LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN, VIEW_LOT_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';

export type ViewLotCreateProps = LotManagementSchema.RPC.DTO.ViewLotCreate.Payload;
export type ViewLotCreateResult = LotManagementSchema.RPC.DTO.ViewLotCreate.Result;

export class ViewLotCreate implements UseCase<ViewLotCreateProps, ViewLotCreateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private readonly lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(VIEW_LOT_REPOSITORY_INJECT_TOKEN)
  private readonly viewLotRepository: InjectContext<VIEW_LOT_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: ViewLotCreateProps): Promise<void> {
    validateRoot(payload, {
      lotId: [isRequiredSchema, isNumberSchema],
    });
  }

  async execute(payload: ViewLotCreateProps): Promise<ViewLotCreateResult> {
    const uow = await this.uow();
    const viewLotRepository = await this.viewLotRepository();
    const lotRepository = await this.lotRepository();

    const lotPk = new LotPK(payload.lotId);

    const lot = await lotRepository.get(lotPk);

    if (NullableObject.isEmpty(lot)) throw new LotNotFoundError(payload.lotId);

    const viewLotPk = await viewLotRepository.nextPk();

    const viewLot = ViewLot.create(viewLotPk, lotPk);

    viewLotRepository.add(viewLot);

    await uow.commit();
  }
}
