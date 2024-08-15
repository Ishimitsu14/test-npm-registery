import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { AssetPK } from '../../../Domain';
import { ASSET_REPOSITORY_INJECT_TOKEN } from '../../InjectTokens';
import { AssetResourceMapper } from '../../ResourceMappers';

export type AssetGetByIdProps = LotManagementSchema.RPC.DTO.AssetGetById.Payload;
export type AssetGetByIdResult = LotManagementSchema.RPC.DTO.AssetGetById.Result;

export class AssetGetById implements UseCase<AssetGetByIdProps, AssetGetByIdResult> {
  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private readonly assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  @Inject(AssetResourceMapper)
  private assetResourceMapper: AssetResourceMapper;

  async validate(payload: AssetGetByIdProps) {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: AssetGetByIdProps): Promise<AssetGetByIdResult> {
    const assetRepository = await this.assetRepository();

    const assetPK = new AssetPK(payload.id);
    const asset = await assetRepository.get(assetPK);
    if (NullableObject.isEmpty(asset)) throw new AssetNotFoundError(payload.id);

    return this.assetResourceMapper.toAsset(asset);
  }
}
