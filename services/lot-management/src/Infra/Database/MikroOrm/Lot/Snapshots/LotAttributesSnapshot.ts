import { Nullable, NullableObject } from '@ddd/core';
import { createSnapshotFromDomain, ISnapshot } from '@ddd/infra';
import { DecimalType, Embeddable, Embedded, ManyToOne, Property, Ref, Reference } from '@mikro-orm/core';
import Decimal from 'decimal.js';

import {
  AdditionalInfo,
  AssetPK,
  AttributeValueListCollection,
  InvestorType,
  InvestRound,
  LockupPeriod,
  LotAttributes,
  LotBadgePK,
  LotCompletedReasonType,
  LotInputs,
  LotReassignmentType,
  LotRejectReason,
  MediatorType,
  Percent,
  Precision,
  Price,
  StablecoinQuantity,
  Telegram,
  TGE,
  TradeDirection,
  UnitQuantity,
  VestingPeriod,
} from '../../../../../Domain';
import { AssetSnapshot } from '../../Asset';
import { InvestorTypeSnapshot, InvestRoundSnapshot, MediatorTypeSnapshot, TradeDirectionSnapshot } from '../../Common';
import { LotBadgeSnapshot } from '../../LotBadge';
import { LotCompletedReasonTypeSnapshot, LotReassignmentTypeSnapshot, LotRejectReasonSnapshot } from './Enums';
import { LotAssetRequestSnapshot } from './LotAssetRequestSnapshot';

@Embeddable()
export class LotAttributesSnapshot implements ISnapshot<AttributeValueListCollection> {
  // COMMON
  @Property({ fieldName: 'common_price', type: DecimalType, nullable: true })
  commonPrice: Nullable<Decimal>;

  @TradeDirectionSnapshot({ fieldName: 'common_direction', nullable: true })
  commonDirection?: TradeDirectionSnapshot;

  @MediatorTypeSnapshot({ fieldName: 'common_mediator', nullable: true })
  commonMediator?: MediatorTypeSnapshot;

  @Property({ fieldName: 'common_telegram', type: 'varchar', nullable: true })
  commonTelegram?: string;

  @Property({ fieldName: 'common_deadline', nullable: true })
  commonDeadline?: Date;

  @Property({ fieldName: 'common_additional_info', type: 'text', nullable: true })
  commonAdditionalInfo?: string;

  @InvestorTypeSnapshot({ fieldName: 'common_offer_maker_types', nullable: true })
  commonOfferMakerTypes?: InvestorTypeSnapshot;

  @InvestorTypeSnapshot({ fieldName: 'common_bid_maker_types', nullable: true })
  commonBidMakerTypes?: InvestorTypeSnapshot;

  @Property({ fieldName: 'common_units', type: DecimalType, nullable: true })
  commonUnits: Nullable<Decimal>;

  @Property({ fieldName: 'common_summary', type: DecimalType, nullable: true })
  commonSummary: Nullable<Decimal>;

  @Property({ fieldName: 'common_min_filter_units', type: DecimalType, nullable: true })
  commonMinFilterUnits: Nullable<Decimal>;

  @Property({ fieldName: 'common_min_filter_summary', type: DecimalType, nullable: true })
  commonMinFilterSummary: Nullable<Decimal>;

  // INVEST_DOC
  @Embedded({
    entity: () => LotAssetRequestSnapshot,
    nullable: true,
  })
  invest_doc_asset_request: Nullable<LotAssetRequestSnapshot>;
  // @Property({
  //   fieldName: 'invest_doc_asset_request',
  //   nullable: true,
  //   type: 'json',
  // })
  // InvestDocasset_request: Nullable<LotAssetRequest>;

  @LotReassignmentTypeSnapshot({ fieldName: 'invest_doc_reassignment_type', nullable: true })
  investDocReassignmentType?: LotReassignmentTypeSnapshot;

  @Property({ fieldName: 'invest_doc_fdv', type: 'numeric', nullable: true })
  investDocFdv?: string;

  @Property({ fieldName: 'invest_doc_share', type: 'float', nullable: true })
  investDocShare?: number;

  @InvestRoundSnapshot({ fieldName: 'invest_doc_round_type', nullable: true })
  investDocRoundType?: InvestRoundSnapshot;

  @Property({ fieldName: 'invest_doc_round_price', type: 'numeric', nullable: true })
  investDocRoundPrice?: string;

  @Property({ fieldName: 'invest_doc_round_units', type: 'numeric', nullable: true })
  investDocRoundUnits?: string;

  @Property({ fieldName: 'invest_doc_round_fdv', type: 'numeric', nullable: true })
  investDocRoundFdv?: string;

  @Property({ fieldName: 'invest_doc_round_share', type: 'float', nullable: true })
  investDocRoundShare?: number;

  @Property({ fieldName: 'invest_doc_round_summary', type: 'numeric', nullable: true })
  investDocRoundSummary?: string;

  // SAFE
  @Property({ fieldName: 'safe_with_token_warrant', type: 'boolean', nullable: true })
  safeWithTokenWarrant?: boolean;

  // TOKEN
  @Property({ fieldName: 'token_tge', nullable: true })
  tokenTge?: Date;

  @Property({ fieldName: 'token_lockup_period', type: 'varchar', nullable: true })
  tokenLockupPeriod?: string;

  @Property({ fieldName: 'token_vesting_period', type: 'varchar', nullable: true })
  tokenVestingPeriod?: string;

  // ATRTIBUTES

  @Property({ fieldName: 'common_created_at', nullable: true })
  commonCreatedAt?: Date;

  @Property({ fieldName: 'common_send_on_moderation_at', nullable: true })
  commonSendOnModerationAt?: Date;

  @Property({ fieldName: 'common_published_at', nullable: true })
  commonPublishedAt?: Date;

  @Property({ fieldName: 'common_completed_at', nullable: true })
  commonCompletedAt?: Date;

  @LotCompletedReasonTypeSnapshot({ fieldName: 'common_completed_reason', nullable: true })
  commonCompletedReason?: LotCompletedReasonTypeSnapshot;

  @Property({ fieldName: 'common_rejected_at', nullable: true })
  commonRejectedAt?: Date;

  @LotRejectReasonSnapshot({ fieldName: 'common_rejected_reason', nullable: true })
  commonRejectedReason?: LotRejectReasonSnapshot;

  @Property({ fieldName: 'common_archived_at', nullable: true })
  commonArchivedAt?: Date;

  @ManyToOne({ entity: () => LotBadgeSnapshot, nullable: true, ref: true, fieldName: 'common_badge_id' })
  commonBadge?: Ref<LotBadgeSnapshot>;

  // BOOSTER INFO

  @InvestRoundSnapshot({ fieldName: 'booster_info_round_type', nullable: true })
  boosterInfoRoundType?: InvestRoundSnapshot;

  @Property({ fieldName: 'booster_info_fdv', type: 'numeric', nullable: true })
  boosterInfoFdv?: Nullable<Decimal>;

  @Property({ fieldName: 'booster_info_round_price', type: DecimalType, nullable: true })
  boosterInfoRoundPrice?: string;

  @Property({ fieldName: 'booster_info_previous_round_price', type: DecimalType, nullable: true })
  boosterInfoPreviousRoundPrice?: string;

  @Property({ fieldName: 'booster_info_future_round_price', type: DecimalType, nullable: true })
  boosterInfoFutureRoundPrice?: string;

  @Property({ fieldName: 'booster_info_listing_timeline', nullable: true })
  boosterInfoListingTimeline?: Date;

  @Property({ fieldName: 'booster_info_additional_info', type: 'text', nullable: true })
  boosterInfoAdditionalInfo?: string;

  @ManyToOne({ entity: () => AssetSnapshot, nullable: true, ref: true, fieldName: 'invest_doc_asset_id' })
  investDocAsset?: Ref<AssetSnapshot>;

  applyDomain(domain: AttributeValueListCollection): void {
    this.commonPrice = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_PRICE_INPUT), (m) => m.value);
    this.commonDirection = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_DIRECTION_INPUT), (m) => m.id);
    this.commonMediator = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_MEDIATOR_INPUT), (m) => m.id);
    this.commonTelegram = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_TELEGRAM_INPUT), (m) => m.value);
    this.commonDeadline = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_DEADLINE_INPUT));
    this.commonOfferMakerTypes = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_OFFER_MAKER_TYPES_INPUT), (m) => m.id);
    this.commonBidMakerTypes = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_BID_MAKER_TYPES_INPUT), (m) => m.id);
    this.commonUnits = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_UNITS_INPUT), (m) => m.value);
    this.commonSummary = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_SUMMARY_INPUT), (m) => m.value);
    this.commonMinFilterUnits = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_MIN_FILTER_UNITS_INPUT), (m) => m.value);
    this.commonMinFilterSummary = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_MIN_FILTER_SUMMARY_INPUT), (m) => m.value);
    this.commonAdditionalInfo = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_ADDITIONAL_INFO_INPUT), (m) => m.value);
    this.commonBadge = NullableObject.mapNull(domain.findValue(LotInputs.COMMON_BADGE_INPUT), (m) => Reference.createFromPK(LotBadgeSnapshot, m.id));

    this.invest_doc_asset_request = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT), (m) => createSnapshotFromDomain(LotAssetRequestSnapshot, m));
    this.investDocAsset = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_ASSET_PK_INPUT), (m) => Reference.createFromPK(AssetSnapshot, m.id));
    this.investDocReassignmentType = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_REASSIGNMENT_TYPE_INPUT), (m) => m.id);
    this.investDocFdv = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_FDV_INPUT), (m) => m.value.toString());
    this.investDocShare = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_SHARE_INPUT), (m) => m.value.toNumber());
    this.investDocRoundType = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_ROUND_TYPE_INPUT), (m) => m.id);
    this.investDocRoundPrice = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_ROUND_PRICE_INPUT), (m) => m.value.toString());
    this.investDocRoundUnits = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_ROUND_UNITS_INPUT), (m) => m.value.toString());
    this.investDocRoundFdv = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_ROUND_FDV_INPUT), (m) => m.value.toString());
    this.investDocRoundShare = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_ROUND_SHARE_INPUT), (m) => m.value.toNumber());
    this.investDocRoundSummary = NullableObject.mapNull(domain.findValue(LotInputs.INVEST_DOC_ROUND_SUMMARY_INPUT), (m) => m.value.toString());

    this.safeWithTokenWarrant = NullableObject.mapNull(domain.findValue(LotInputs.SAFE_WITH_TOKEN_WARRANT_INPUT));

    this.tokenTge = NullableObject.mapNull(domain.findValue(LotInputs.TOKEN_TGE_INPUT), (m) => NullableObject.mapNull(m.date));
    this.tokenLockupPeriod = NullableObject.mapNull(domain.findValue(LotInputs.TOKEN_LOCKUP_PERIOD_INPUT), (m) => NullableObject.mapNull(m.period));
    this.tokenVestingPeriod = NullableObject.mapNull(domain.findValue(LotInputs.TOKEN_VESTING_PERIOD_INPUT), (m) => m.value);

    // Attributes
    this.commonCreatedAt = NullableObject.mapNull(domain.findValue(LotAttributes.COMMON_CREATED_AT_ATTRIBUTE));
    this.commonSendOnModerationAt = NullableObject.mapNull(domain.findValue(LotAttributes.COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE));
    this.commonPublishedAt = NullableObject.mapNull(domain.findValue(LotAttributes.COMMON_PUBLISHED_AT_ATTRIBUTE));
    this.commonCompletedAt = NullableObject.mapNull(domain.findValue(LotAttributes.COMMON_COMPLETED_AT_ATTRIBUTE));
    this.commonCompletedReason = NullableObject.mapNull(domain.findValue(LotAttributes.COMMON_COMPLETED_REASON_ATTRIBUTE), (m) => m.id);
    this.commonRejectedAt = NullableObject.mapNull(domain.findValue(LotAttributes.COMMON_REJECTED_AT_ATTRIBUTE));
    this.commonRejectedReason = NullableObject.mapNull(domain.findValue(LotAttributes.COMMON_REJECT_REASON_ATTRIBUTE), (m) => m.id);
    this.commonArchivedAt = NullableObject.mapNull(domain.findValue(LotAttributes.COMMON_ARCHIVED_AT_ATTRIBUTE));

    // Booster info
    this.boosterInfoRoundType = NullableObject.mapNull(domain.findValue(LotInputs.BOOSTER_INFO_ROUND_TYPE_INPUT), (m) => m.id);
    this.boosterInfoFdv = NullableObject.mapNull(domain.findValue(LotInputs.BOOSTER_INFO_FDV_INPUT), (m) => m.value);
    this.boosterInfoRoundPrice = NullableObject.mapNull(domain.findValue(LotInputs.BOOSTER_INFO_ROUND_PRICE_INPUT), (m) => m.value.toString());
    this.boosterInfoPreviousRoundPrice = NullableObject.mapNull(domain.findValue(LotInputs.BOOSTER_INFO_PREVIOUS_ROUND_PRICE_INPUT), (m) => m.value.toString());
    this.boosterInfoFutureRoundPrice = NullableObject.mapNull(domain.findValue(LotInputs.BOOSTER_INFO_FUTURE_ROUND_PRICE_INPUT), (m) => m.value.toString());
    this.boosterInfoListingTimeline = NullableObject.mapNull(domain.findValue(LotInputs.BOOSTER_INFO_LISTING_TIMELINE_INPUT));
    this.boosterInfoAdditionalInfo = NullableObject.mapNull(domain.findValue(LotInputs.BOOSTER_INFO_ADDITIONAL_INFO_INPUT), (m) => m.value);
  }

  toDomain(): AttributeValueListCollection {
    const attributes = new AttributeValueListCollection();

    attributes.setValue(this.commonPrice, LotInputs.COMMON_PRICE_INPUT, (m) => Price.fromNumber(m, Precision.DYNAMIC));
    attributes.setValue(this.commonDirection, LotInputs.COMMON_DIRECTION_INPUT, (m) => TradeDirection.getById(m));
    attributes.setValue(this.commonMediator, LotInputs.COMMON_MEDIATOR_INPUT, (m) => MediatorType.getById(m));
    attributes.setValue(this.commonTelegram, LotInputs.COMMON_TELEGRAM_INPUT, (m) => Telegram.fromSnapshot(m));
    attributes.setValue(this.commonDeadline, LotInputs.COMMON_DEADLINE_INPUT);
    attributes.setValue(this.commonAdditionalInfo, LotInputs.COMMON_ADDITIONAL_INFO_INPUT, (m) => AdditionalInfo.fromSnapshot(m));
    attributes.setValue(this.commonOfferMakerTypes, LotInputs.COMMON_OFFER_MAKER_TYPES_INPUT, (m) => InvestorType.getById(m));
    attributes.setValue(this.commonBidMakerTypes, LotInputs.COMMON_BID_MAKER_TYPES_INPUT, (m) => InvestorType.getById(m));
    attributes.setValue(this.commonUnits, LotInputs.COMMON_UNITS_INPUT, (m) => UnitQuantity.fromNumber(m, Precision.DYNAMIC));
    attributes.setValue(this.commonSummary, LotInputs.COMMON_SUMMARY_INPUT, (m) => StablecoinQuantity.fromNumber(m));
    attributes.setValue(this.commonMinFilterUnits, LotInputs.COMMON_MIN_FILTER_UNITS_INPUT, (m) => UnitQuantity.fromNumber(m, Precision.DYNAMIC));
    attributes.setValue(this.commonMinFilterSummary, LotInputs.COMMON_MIN_FILTER_SUMMARY_INPUT, (m) => StablecoinQuantity.fromNumber(m));
    attributes.setValue(this.commonBadge, LotInputs.COMMON_BADGE_INPUT, (m) => LotBadgePK.fromSnapshot(m.id));

    attributes.setValue(this.invest_doc_asset_request, LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT, (m) => m.toDomain());
    attributes.setValue(this.investDocAsset, LotInputs.INVEST_DOC_ASSET_PK_INPUT, (m) => AssetPK.fromSnapshot(m.id));
    attributes.setValue(this.investDocReassignmentType, LotInputs.INVEST_DOC_REASSIGNMENT_TYPE_INPUT, (m) => LotReassignmentType.getById(m));
    attributes.setValue(this.investDocFdv, LotInputs.INVEST_DOC_FDV_INPUT, (m) => StablecoinQuantity.fromNumber(m));
    attributes.setValue(this.investDocShare, LotInputs.INVEST_DOC_SHARE_INPUT, (m) => Percent.fromFloat(m, Precision.DYNAMIC));
    attributes.setValue(this.investDocRoundType, LotInputs.INVEST_DOC_ROUND_TYPE_INPUT, (m) => InvestRound.getById(m));
    attributes.setValue(this.investDocRoundPrice, LotInputs.INVEST_DOC_ROUND_PRICE_INPUT, (m) => Price.fromNumber(m, Precision.DYNAMIC));
    attributes.setValue(this.investDocRoundUnits, LotInputs.INVEST_DOC_ROUND_UNITS_INPUT, (m) => UnitQuantity.fromNumber(m, Precision.DYNAMIC));
    attributes.setValue(this.investDocRoundFdv, LotInputs.INVEST_DOC_ROUND_FDV_INPUT, (m) => StablecoinQuantity.fromNumber(m));
    attributes.setValue(this.investDocRoundShare, LotInputs.INVEST_DOC_ROUND_SHARE_INPUT, (m) => Percent.fromFloat(m, Precision.DYNAMIC));
    attributes.setValue(this.investDocRoundSummary, LotInputs.INVEST_DOC_ROUND_SUMMARY_INPUT, (m) => StablecoinQuantity.fromNumber(m));

    attributes.setValue(this.safeWithTokenWarrant, LotInputs.SAFE_WITH_TOKEN_WARRANT_INPUT);

    attributes.setValue(this.tokenTge, LotInputs.TOKEN_TGE_INPUT, (m) => TGE.fromDate(m));
    attributes.setValue(this.tokenLockupPeriod, LotInputs.TOKEN_LOCKUP_PERIOD_INPUT, (m) => LockupPeriod.fromString(m));
    attributes.setValue(this.tokenVestingPeriod, LotInputs.TOKEN_VESTING_PERIOD_INPUT, (m) => VestingPeriod.create(m));

    // Attributes

    attributes.setValue(this.commonCreatedAt, LotAttributes.COMMON_CREATED_AT_ATTRIBUTE);
    attributes.setValue(this.commonSendOnModerationAt, LotAttributes.COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE);
    attributes.setValue(this.commonPublishedAt, LotAttributes.COMMON_PUBLISHED_AT_ATTRIBUTE);
    attributes.setValue(this.commonCompletedAt, LotAttributes.COMMON_COMPLETED_AT_ATTRIBUTE);
    attributes.setValue(this.commonCompletedReason, LotAttributes.COMMON_COMPLETED_REASON_ATTRIBUTE, (m) => LotCompletedReasonType.getById(m));
    attributes.setValue(this.commonRejectedAt, LotAttributes.COMMON_REJECTED_AT_ATTRIBUTE);
    attributes.setValue(this.commonRejectedReason, LotAttributes.COMMON_REJECT_REASON_ATTRIBUTE, (m) => LotRejectReason.getById(m));
    attributes.setValue(this.commonArchivedAt, LotAttributes.COMMON_ARCHIVED_AT_ATTRIBUTE);

    // Booster info
    attributes.setValue(this.boosterInfoRoundType, LotInputs.BOOSTER_INFO_ROUND_TYPE_INPUT, (m) => InvestRound.getById(m));
    attributes.setValue(this.boosterInfoFdv, LotInputs.BOOSTER_INFO_FDV_INPUT, (m) => StablecoinQuantity.fromNumber(m));
    attributes.setValue(this.boosterInfoRoundPrice, LotInputs.BOOSTER_INFO_ROUND_PRICE_INPUT, (m) => Price.fromNumber(m, Precision.DYNAMIC));
    attributes.setValue(this.boosterInfoPreviousRoundPrice, LotInputs.BOOSTER_INFO_PREVIOUS_ROUND_PRICE_INPUT, (m) => Price.fromNumber(m, Precision.DYNAMIC));
    attributes.setValue(this.boosterInfoFutureRoundPrice, LotInputs.BOOSTER_INFO_FUTURE_ROUND_PRICE_INPUT, (m) => Price.fromNumber(m, Precision.DYNAMIC));
    attributes.setValue(this.boosterInfoListingTimeline, LotInputs.BOOSTER_INFO_LISTING_TIMELINE_INPUT);
    attributes.setValue(this.boosterInfoAdditionalInfo, LotInputs.BOOSTER_INFO_ADDITIONAL_INFO_INPUT, (m) => AdditionalInfo.fromSnapshot(m));

    return attributes;
  }
}
