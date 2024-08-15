import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetFaqNotFoundError, AssetNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { AssetFaqPK, AssetPK } from '../../../Domain';
import { ASSET_FAQ_REPOSITORY_INJECT_TOKEN, ASSET_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

type UpdateProps = LotManagementSchema.RPC.DTO.AssetFaqUpdate.Payload;
type UpdateResult = LotManagementSchema.RPC.DTO.AssetFaqUpdate.Result;

export class AssetFaqUpdate implements UseCase<UpdateProps, UpdateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(ASSET_FAQ_REPOSITORY_INJECT_TOKEN)
  private readonly assetFaqRepository: InjectContext<ASSET_FAQ_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private readonly assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: UpdateProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
      asset: [isRequiredSchema, isStringWithValueSchema],
      question: [isRequiredSchema, isStringWithValueSchema],
      answer: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: UpdateProps): Promise<UpdateResult> {
    const uow = await this.uow();
    const assetFaqRepository = await this.assetFaqRepository();
    const assetRepository = await this.assetRepository();

    const assetPK = new AssetPK(payload.asset);
    const asset = await assetRepository.get(assetPK);
    if (NullableObject.isEmpty(asset)) throw new AssetNotFoundError(payload.asset);

    const assetFaqPK = AssetFaqPK.raw(payload.id);
    const assetFaq = await assetFaqRepository.get(assetFaqPK);
    if (NullableObject.isEmpty(assetFaq)) throw new AssetFaqNotFoundError(payload.id);

    assetFaq.update(assetPK, payload.question, payload.answer);

    assetFaqRepository.update(assetFaq);
    await uow.commit();
  }
}
