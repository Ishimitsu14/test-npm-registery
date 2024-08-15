import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { AssetPK } from '../../../Domain';
import { ASSET_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

type ArchiveProps = LotManagementSchema.RPC.DTO.AssetArchive.Payload;
type ArchiveResult = LotManagementSchema.RPC.DTO.AssetArchive.Result;

export class AssetArchive implements UseCase<ArchiveProps, ArchiveResult> {
  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  async validate(payload: ArchiveProps): Promise<void> {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: ArchiveProps): Promise<ArchiveResult> {
    const uow = await this.uow();
    const assetRepository = await this.assetRepository();

    const asset = await assetRepository.get(AssetPK.fromSnapshot(payload.id));
    if (NullableObject.isEmpty(asset)) throw new AssetNotFoundError(payload.id);

    asset.archive();
    assetRepository.update(asset);

    await uow.commit();
  }
}
