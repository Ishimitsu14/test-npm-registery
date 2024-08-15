import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { LotManagementSchema } from '@schema/lot-management';

import { LotBadge, LotBadgePK } from '../../../Domain';
import { LOT_BADGE_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { LotBadgeResourceMapper } from '../../ResourceMappers';

export type LotBadgeCreateProps = LotManagementSchema.RPC.DTO.LotBadgeCreate.Payload;
export type LotBadgeCreateResult = LotManagementSchema.RPC.DTO.LotBadgeCreate.Result;

export class LotBadgeCreate implements UseCase<LotBadgeCreateProps, LotBadgeCreateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(LOT_BADGE_REPOSITORY_INJECT_TOKEN)
  private lotBadgeRepository: InjectContext<LOT_BADGE_REPOSITORY_INJECT_TOKEN>;

  @Inject(LotBadgeResourceMapper)
  private lotBadgeResourceMapper: LotBadgeResourceMapper;

  async validate(payload: LotBadgeCreateProps): Promise<void> {}

  async execute(payload: LotBadgeCreateProps): Promise<LotBadgeCreateResult> {
    const uow = await this.uow();
    const lotBadgeRepository = await this.lotBadgeRepository();

    const lotBadgePk = new LotBadgePK(payload.id);

    const lotBadge = LotBadge.createNew(lotBadgePk, payload.sort);

    lotBadgeRepository.add(lotBadge);

    await uow.commit();

    return this.lotBadgeResourceMapper.toLotBadge(lotBadge);
  }
}
