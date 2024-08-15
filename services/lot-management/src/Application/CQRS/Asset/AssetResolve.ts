import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { AssetPK, AttributeValueListCollection, Lot, LotByAssetCreateRequestSpecification, LotInputs } from '../../../Domain';
import { ASSET_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type AssetResolveProps = LotManagementSchema.RPC.DTO.AssetResolve.Payload;
export type AssetResolveResult = LotManagementSchema.RPC.DTO.AssetResolve.Result;

export class AssetResolve implements UseCase<AssetResolveProps, AssetResolveResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private readonly assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private readonly lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: AssetResolveProps) {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: AssetResolveProps): Promise<AssetResolveResult> {
    const uow = await this.uow();
    const assetRepository = await this.assetRepository();
    const lotRepository = await this.lotRepository();

    const assetPK = new AssetPK(payload.id);
    const asset = await assetRepository.get(assetPK);

    if (NullableObject.isEmpty(asset)) throw new AssetNotFoundError(payload.id);

    const query = Query.create(Lot).addSpecification(new LotByAssetCreateRequestSpecification(asset.info.title));

    const lots = await lotRepository.find(query);

    const attributes = new AttributeValueListCollection();

    attributes.setValue(assetPK, LotInputs.INVEST_DOC_ASSET_PK_INPUT);
    attributes.removeAttribute(LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT);

    for (const lot of lots.items) {
      lot.updateAttributes(attributes);
      lotRepository.update(lot);
    }

    await uow.commit();
  }
}
