import { UseCase } from '@ddd/application';
import { ListCollection, NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetIsAlreadyExistsError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isArraySchema, isEnumSchema, isRequiredSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import { Asset, AssetInfo, AssetLink, AssetLinkType, AssetPK, AssetTier, AssetVertical, FilePK } from '../../../Domain';
import { ASSET_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { AssetResourceMapper } from '../../ResourceMappers';

export type AssetCreateProps = LotManagementSchema.RPC.DTO.AssetCreate.Payload;
export type AssetCreateResult = LotManagementSchema.RPC.DTO.AssetCreate.Result;

export class AssetCreate implements UseCase<AssetCreateProps, AssetCreateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private readonly assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  @Inject(AssetResourceMapper)
  private assetResourceMapper: AssetResourceMapper;

  async validate(payload: AssetCreateProps) {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema, maxSchema(20)],
      title: [isRequiredSchema, isStringWithValueSchema, maxSchema(60)],
      description: [isRequiredSchema, isStringWithValueSchema, maxSchema(1000)],
      verticals: [isRequiredSchema, isArraySchema(isEnumSchema(AssetVertical.getAllIds()), minSchema(1))],
      tier: [isRequiredSchema, isEnumSchema(AssetTier.getAllIds())],
      links: [isRequiredSchema, isArraySchema([])],
      logoFile: [isStringWithValueSchema],
      analyticFile: [isStringWithValueSchema],
    });
  }

  async execute(payload: AssetCreateProps): Promise<AssetCreateResult> {
    const uow = await this.uow();
    const assetRepository = await this.assetRepository();

    const pk = new AssetPK(payload.id);
    if (NullableObject.hasValue(await assetRepository.get(pk))) throw new AssetIsAlreadyExistsError(payload.id);

    // Info
    const verticals = AssetVertical.getByIds(payload.verticals);
    const tier = AssetTier.getById(payload.tier);
    const links = payload.links.map((item) => {
      return AssetLink.create(AssetLinkType.getById(item.type), item.url).setCustomTitle(NullableObject(item.title));
    });

    const assetInfo = AssetInfo.createNew(payload.title, payload.description, tier)
      .setVerticals(new ListCollection(verticals))
      .setLinks(new ListCollection(links))
      .setLogoFile(NullableObject.map(payload.logoFile, (m) => new FilePK(m)))
      .setAnalyticFile(NullableObject.map(payload.analyticFile, (m) => new FilePK(m)));

    const asset = Asset.create(pk, assetInfo, 0);

    assetRepository.add(asset);
    await uow.commit();

    return this.assetResourceMapper.toAssetKey(pk);
  }
}
