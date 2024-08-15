import { UseCase } from '@ddd/application';
import { ListCollection, NullableObject, VoidableObject } from '@ddd/core';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetNotFoundError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';
import { isArraySchema, isEnumSchema, isRequiredSchema, isStringWithValueSchema, maxSchema, minSchema, validateRoot } from '@shared/validation';

import { AssetLink, AssetLinkType, AssetPK, AssetTier, AssetVertical, FilePK } from '../../../Domain';
import { ASSET_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type AssetUpdateProps = LotManagementSchema.RPC.DTO.AssetUpdate.Payload;
export type AssetUpdateResult = LotManagementSchema.RPC.DTO.AssetUpdate.Result;

export class AssetUpdate implements UseCase<AssetUpdateProps, AssetUpdateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private readonly assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: AssetUpdateProps) {
    validateRoot(payload, {
      id: [isRequiredSchema, isStringWithValueSchema, maxSchema(20)],
      title: [isStringWithValueSchema, maxSchema(60)],
      description: [isStringWithValueSchema, maxSchema(1000)],
      verticals: [isArraySchema(isEnumSchema(AssetVertical.getAllIds()), minSchema(1))],
      tier: [isEnumSchema(AssetTier.getAllIds())],
      // TODO
      links: [],
      logoFile: [isStringWithValueSchema],
      analyticFile: [isStringWithValueSchema],
    });
  }

  async execute(payload: AssetUpdateProps): Promise<AssetUpdateResult> {
    const uow = await this.uow();
    const assetRepository = await this.assetRepository();

    const pk = new AssetPK(payload.id);
    const asset = await assetRepository.get(pk);
    if (NullableObject.isEmpty(asset)) throw new AssetNotFoundError(payload.id);

    if (VoidableObject.hasValue(payload.title)) {
      asset.updateInfo((info) => info.setTitle(payload.title));
    }

    if (VoidableObject.hasValue(payload.description)) {
      asset.updateInfo((info) => info.setDescription(payload.description));
    }

    if (VoidableObject.hasValue(payload.logoFile)) {
      asset.updateInfo((info) => info.setLogoFile(new FilePK(payload.logoFile)));
    }

    if (VoidableObject.hasValue(payload.analyticFile)) {
      asset.updateInfo((info) => info.setAnalyticFile(new FilePK(payload.analyticFile)));
    }

    if (VoidableObject.hasValue(payload.verticals)) {
      asset.updateInfo((info) => info.setVerticals(new ListCollection(AssetVertical.getByIds(payload.verticals))));
    }

    if (VoidableObject.hasValue(payload.tier)) {
      asset.updateInfo((info) => info.setTier(AssetTier.getById(payload.tier)));
    }

    if (VoidableObject.hasValue(payload.links)) {
      const links = payload.links.map((item) => {
        return AssetLink.create(AssetLinkType.getById(item.type), item.url).setCustomTitle(NullableObject(item.title));
      });
      asset.updateInfo((info) => info.setLinks(new ListCollection(links)));
    }

    assetRepository.update(asset);
    await uow.commit();
  }
}
