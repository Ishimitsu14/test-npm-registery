import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetFaqNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';
import { AssetFaqPK } from 'services/lot-management/src/Domain';

import { ASSET_FAQ_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

type DeleteProps = LotManagementSchema.RPC.DTO.AssetFaqDelete.Payload;
type DeleteResult = LotManagementSchema.RPC.DTO.AssetFaqDelete.Result;

export class AssetFaqDelete implements UseCase<DeleteProps, DeleteResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(ASSET_FAQ_REPOSITORY_INJECT_TOKEN)
  private readonly assetFaqRepository: InjectContext<ASSET_FAQ_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: DeleteProps) {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: DeleteProps): Promise<DeleteResult> {
    const uow = await this.uow();
    const assetFaqRepository = await this.assetFaqRepository();

    const pk = AssetFaqPK.raw(payload.id);

    const assetFaq = await assetFaqRepository.get(pk);

    if (NullableObject.isEmpty(assetFaq)) throw new AssetFaqNotFoundError(payload.id);

    assetFaqRepository.removeByPK(pk);

    await uow.commit();
  }
}
