import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { AssetFaq, AssetPK } from '../../../Domain';
import { ASSET_FAQ_REPOSITORY_INJECT_TOKEN, ASSET_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { AssetFaqResourceMapper } from '../../ResourceMappers';

type CreateProps = LotManagementSchema.RPC.DTO.AssetFaqCreate.Payload;
type CreateResult = LotManagementSchema.RPC.DTO.AssetFaqCreate.Result;

export class AssetFaqCreate implements UseCase<CreateProps, CreateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(ASSET_FAQ_REPOSITORY_INJECT_TOKEN)
  private readonly assetFaqRepository: InjectContext<ASSET_FAQ_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private readonly assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  @Inject(AssetFaqResourceMapper)
  private assetFaqResourceMapper: AssetFaqResourceMapper;

  async validate(payload: CreateProps): Promise<void> {
    validateRoot(payload, {
      asset: [isRequiredSchema, isStringWithValueSchema],
      question: [isRequiredSchema, isStringWithValueSchema],
      answer: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: CreateProps): Promise<CreateResult> {
    const uow = await this.uow();
    const assetFaqRepository = await this.assetFaqRepository();
    const assetRepository = await this.assetRepository();

    const assetPK = new AssetPK(payload.asset);
    const asset = await assetRepository.get(assetPK);
    if (NullableObject.isEmpty(asset)) throw new AssetNotFoundError(payload.asset);

    const assetFaqPK = await assetFaqRepository.nextPK();

    const assetFaq = AssetFaq.createNew(assetFaqPK, assetPK, payload.question, payload.answer);

    assetFaqRepository.add(assetFaq);
    await uow.commit();

    return this.assetFaqResourceMapper.toAssetFaq(assetFaq);
  }
}
