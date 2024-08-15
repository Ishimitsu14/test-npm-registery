import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { AssetNotFoundError, LotBadgeNotFoundError, LotUnsupportedTypeError } from '@schema/common';
import { LotManagementSchema } from '@schema/lot-management';

import {
  AdditionalInfo,
  AssetPK,
  AttributeValueListCollection,
  InvestorType,
  InvestRound,
  LockupPeriod,
  Lot,
  LotAssetRequest,
  LotBadgePK,
  LotInputs,
  LotReassignmentType,
  LotType,
  MediatorType,
  OfferMakerPK,
  Percent,
  Precision,
  Price,
  StablecoinQuantity,
  Telegram,
  TGE,
  TradeDirection,
  UnitQuantity,
  VestingPeriod,
} from '../../../Domain';
import { ASSET_REPOSITORY_INJECT_TOKEN, LOT_BADGE_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { LotResourceMapper } from '../../ResourceMappers';

export type LotCreateProps = LotManagementSchema.RPC.DTO.LotCreate.Payload;
export type LotCreateResult = LotManagementSchema.RPC.DTO.LotCreate.Result;

export class LotCreate implements UseCase<LotCreateProps, LotCreateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(LOT_BADGE_REPOSITORY_INJECT_TOKEN)
  private lotBadgeRepository: InjectContext<LOT_BADGE_REPOSITORY_INJECT_TOKEN>;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  async validate(payload: LotCreateProps): Promise<void> {}

  async execute(payload: LotCreateProps): Promise<LotCreateResult> {
    const uow = await this.uow();
    const lotRepository = await this.lotRepository();

    const lotType = LotType.getById(payload.type);
    if (NullableObject.isEmpty(lotType)) throw new LotUnsupportedTypeError();

    const offerMaker = OfferMakerPK.create(payload.offerMaker);
    const attributes = await this.getAttributesFromInput(payload.inputs || {});

    const lotPK = await lotRepository.nextPK();
    const lot = Lot.createDraft(lotPK, offerMaker, lotType, attributes);

    lotRepository.add(lot);
    await uow.commit();

    return this.lotResourceMapper.toLotKey(lot.primaryKey);
  }

  public async getAttributesFromInput(inputs: LotManagementSchema.LotInputObject): Promise<AttributeValueListCollection> {
    const assetRepository = await this.assetRepository();
    const lotBadgeRepository = await this.lotBadgeRepository();

    const attributes = new AttributeValueListCollection();

    attributes.setValue(inputs.COMMON_PRICE, LotInputs.COMMON_PRICE_INPUT, (value) => Price.fromNumber(value, Precision.DYNAMIC));
    attributes.setValue(inputs.COMMON_DIRECTION, LotInputs.COMMON_DIRECTION_INPUT, (m) => TradeDirection.getById(m));
    attributes.setValue(inputs.COMMON_MEDIATOR, LotInputs.COMMON_MEDIATOR_INPUT, (value) => MediatorType.getById(value));
    attributes.setValue(inputs.COMMON_TELEGRAM, LotInputs.COMMON_TELEGRAM_INPUT, (value) => Telegram.fromString(value));
    attributes.setValue(inputs.COMMON_DEADLINE, LotInputs.COMMON_DEADLINE_INPUT, (value) => new Date(value));
    attributes.setValue(inputs.COMMON_ADDITIONAL_INFO, LotInputs.COMMON_ADDITIONAL_INFO_INPUT, (value) => AdditionalInfo.fromString(value));

    attributes.setValue(inputs.COMMON_OFFER_MAKER_TYPES, LotInputs.COMMON_OFFER_MAKER_TYPES_INPUT, (value) => InvestorType.getById(value));
    attributes.setValue(inputs.COMMON_BID_MAKER_TYPES, LotInputs.COMMON_BID_MAKER_TYPES_INPUT, (value) => InvestorType.getById(value));
    attributes.setValue(inputs.COMMON_UNITS, LotInputs.COMMON_UNITS_INPUT, (value) => UnitQuantity.fromNumber(value, Precision.DYNAMIC));
    attributes.setValue(inputs.COMMON_SUMMARY, LotInputs.COMMON_SUMMARY_INPUT, (value) => StablecoinQuantity.fromNumber(value));
    attributes.setValue(inputs.COMMON_MIN_FILTER_UNITS, LotInputs.COMMON_MIN_FILTER_UNITS_INPUT, (value) => UnitQuantity.fromNumber(value, Precision.DYNAMIC));
    attributes.setValue(inputs.COMMON_MIN_FILTER_SUMMARY, LotInputs.COMMON_MIN_FILTER_SUMMARY_INPUT, (value) => StablecoinQuantity.fromNumber(value));

    await attributes.setValueAsync(inputs.COMMON_BADGE, LotInputs.COMMON_BADGE_INPUT, async (value) => {
      const lotBadgePk = new LotBadgePK(value);
      const lotBadge = await lotBadgeRepository.get(lotBadgePk);

      if (NullableObject.isEmpty(lotBadge)) throw new LotBadgeNotFoundError(lotBadgePk.id);

      return lotBadge.primaryKey;
    });

    await attributes.setValueAsync(inputs.INVEST_DOC_ASSET_PK, LotInputs.INVEST_DOC_ASSET_PK_INPUT, async (assetId) => {
      const assetPK = new AssetPK(assetId);
      const asset = await assetRepository.get(assetPK);
      if (NullableObject.isEmpty(asset)) throw new AssetNotFoundError(assetPK.id);

      return asset.primaryKey;
    });
    attributes.setValue(inputs.INVEST_DOC_ASSET_CREATE_REQUEST, LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT, (m) => new LotAssetRequest(m.title, m.website, m.pitchDeck, m.tokenomics));
    attributes.setValue(inputs.INVEST_DOC_REASSIGNMENT_TYPE, LotInputs.INVEST_DOC_REASSIGNMENT_TYPE_INPUT, (m) => LotReassignmentType.getById(m));
    attributes.setValue(inputs.INVEST_DOC_FDV, LotInputs.INVEST_DOC_FDV_INPUT, (value) => StablecoinQuantity.fromNumber(value));
    attributes.setValue(inputs.INVEST_DOC_SHARE, LotInputs.INVEST_DOC_SHARE_INPUT, (value) => Percent.fromFloat(value, Precision.DYNAMIC));

    attributes.setValue(inputs.INVEST_DOC_ROUND_TYPE, LotInputs.INVEST_DOC_ROUND_TYPE_INPUT, (m) => InvestRound.getById(m));
    attributes.setValue(inputs.INVEST_DOC_ROUND_PRICE, LotInputs.INVEST_DOC_ROUND_PRICE_INPUT, (value) => Price.fromNumber(value, Precision.DYNAMIC));
    attributes.setValue(inputs.INVEST_DOC_ROUND_UNITS, LotInputs.INVEST_DOC_ROUND_UNITS_INPUT, (value) => UnitQuantity.fromNumber(value, Precision.DYNAMIC));
    attributes.setValue(inputs.INVEST_DOC_ROUND_FDV, LotInputs.INVEST_DOC_ROUND_FDV_INPUT, (value) => StablecoinQuantity.fromNumber(value));
    attributes.setValue(inputs.INVEST_DOC_ROUND_SHARE, LotInputs.INVEST_DOC_ROUND_SHARE_INPUT, (value) => Percent.fromFloat(value, Precision.DYNAMIC));
    attributes.setValue(inputs.INVEST_DOC_ROUND_SUMMARY, LotInputs.INVEST_DOC_ROUND_SUMMARY_INPUT, (value) => StablecoinQuantity.fromNumber(value));

    attributes.setValue(inputs.SAFE_WITH_TOKEN_WARRANT, LotInputs.SAFE_WITH_TOKEN_WARRANT_INPUT);
    attributes.setValue(inputs.TOKEN_TGE, LotInputs.TOKEN_TGE_INPUT, (value) => (value === 'TBD' ? TGE.TBD : TGE.fromDate(new Date(value))));
    attributes.setValue(inputs.TOKEN_LOCKUP_PERIOD, LotInputs.TOKEN_LOCKUP_PERIOD_INPUT, (value) => (value === 'OVER' ? LockupPeriod.IS_OVER : LockupPeriod.fromString(value)));
    attributes.setValue(inputs.TOKEN_VESTING_PERIOD, LotInputs.TOKEN_VESTING_PERIOD_INPUT, (value) => VestingPeriod.create(value));

    attributes.setValue(inputs.BOOSTER_INFO_ROUND_TYPE, LotInputs.BOOSTER_INFO_ROUND_TYPE_INPUT, (m) => InvestRound.getById(m));
    attributes.setValue(inputs.BOOSTER_INFO_FDV, LotInputs.BOOSTER_INFO_FDV_INPUT, (value) => StablecoinQuantity.fromNumber(value));
    attributes.setValue(inputs.BOOSTER_INFO_ROUND_PRICE, LotInputs.BOOSTER_INFO_ROUND_PRICE_INPUT, (value) => Price.fromNumber(value, Precision.DYNAMIC));
    attributes.setValue(inputs.BOOSTER_INFO_PREVIOUS_ROUND_PRICE, LotInputs.BOOSTER_INFO_PREVIOUS_ROUND_PRICE_INPUT, (value) => Price.fromNumber(value, Precision.DYNAMIC));
    attributes.setValue(inputs.BOOSTER_INFO_FUTURE_ROUND_PRICE, LotInputs.BOOSTER_INFO_FUTURE_ROUND_PRICE_INPUT, (value) => Price.fromNumber(value, Precision.DYNAMIC));
    attributes.setValue(inputs.BOOSTER_INFO_LISTING_TIMELINE, LotInputs.BOOSTER_INFO_LISTING_TIMELINE_INPUT, (value) => new Date(value));
    attributes.setValue(inputs.BOOSTER_INFO_ADDITIONAL_INFO, LotInputs.BOOSTER_INFO_ADDITIONAL_INFO_INPUT, (value) => AdditionalInfo.fromString(value));

    return attributes;
  }
}
