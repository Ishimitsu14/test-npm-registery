import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetFaqNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { AssetFaqPK } from '../../../Domain';
import { ASSET_FAQ_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { AssetFaqResourceMapper } from '../../ResourceMappers';

type GetByIdProps = LotManagementSchema.RPC.DTO.AssetFaqGetById.Payload;
type GetByIdResult = LotManagementSchema.RPC.DTO.AssetFaqGetById.Result;

export class AssetFaqGetById implements UseCase<GetByIdProps, GetByIdResult> {
  @InjectContext(ASSET_FAQ_REPOSITORY_INJECT_TOKEN)
  private readonly assetFaqRepository: InjectContext<ASSET_FAQ_REPOSITORY_INJECT_TOKEN>;

  @Inject(AssetFaqResourceMapper)
  private assetFaqResourceMapper: AssetFaqResourceMapper;

  async validate(payload: GetByIdProps) {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: GetByIdProps): Promise<GetByIdResult> {
    const assetFaqRepository = await this.assetFaqRepository();

    const assetFaqPK = AssetFaqPK.raw(payload.id);
    const assetFaq = await assetFaqRepository.get(assetFaqPK);
    if (NullableObject.isEmpty(assetFaq)) throw new AssetFaqNotFoundError(payload.id);

    return this.assetFaqResourceMapper.toAssetFaq(assetFaq);
  }
}
