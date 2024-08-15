import { UseCase } from '@ddd/application';
import { Query, WhereInPKSpecification } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotManagementSchema } from '@schema/lot-management';
import { isNumberSchema, isRequiredSchema, validateRoot } from '@shared/validation';

import { Lot, LotPK, ViewLot, ViewLotByLotSpecification } from '../../../Domain';
import { UNIT_OF_WORK_INJECT_TOKEN, VIEW_LOT_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';

export type ViewLotGetByLotIdProps = LotManagementSchema.RPC.DTO.ViewLotGetByLotId.Payload;
export type ViewLotGetByLotIdResult = LotManagementSchema.RPC.DTO.ViewLotGetByLotId.Result;

export class ViewLotGetByLotId implements UseCase<ViewLotGetByLotIdProps, ViewLotGetByLotIdResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(VIEW_LOT_REPOSITORY_INJECT_TOKEN)
  private readonly viewLotRepository: InjectContext<VIEW_LOT_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: ViewLotGetByLotIdProps): Promise<void> {
    validateRoot(payload, {
      lotId: [isRequiredSchema, isNumberSchema],
    });
  }

  async execute(payload: ViewLotGetByLotIdProps): Promise<ViewLotGetByLotIdResult> {
    const uow = await this.uow();
    const viewLotRepository = await this.viewLotRepository();

    const lotPk = LotPK.fromSnapshot(payload.lotId);

    const whereInPksSpecification = WhereInPKSpecification.create<Lot>(lotPk);

    const viewLots = await viewLotRepository.find(Query.create(ViewLot).addSpecification(new ViewLotByLotSpecification(whereInPksSpecification.primaryKeys)));

    return {
      count: viewLots.count,
    };
  }
}
