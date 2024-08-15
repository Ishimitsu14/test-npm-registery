import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { LotManagementSchema } from '@schema/lot-management';

import {
  AttributeValueListCollection,
  Lot,
  LotAssetRequest,
  LotAttributes,
  LotInputs,
  LotPK,
  LotTotalBidsCountAggregatorResult,
  LotTransactionStatsAggregatorResult,
  LotViewCountAggregatorResult,
} from '../../Domain';
import { ActorResourceMapper } from './ActorResourceMapper';
import { AssetResourceMapper } from './AssetResourceMapper';
import { CommonResourceMapper } from './CommonResourceMapper';

export class LotResourceMapper {
  @Inject(ActorResourceMapper)
  private actorResourceMapper: ActorResourceMapper;

  @Inject(AssetResourceMapper)
  private assetResourceMapper: AssetResourceMapper;

  @Inject(CommonResourceMapper)
  private commonResourceMapper: CommonResourceMapper;

  toLotKey(pk: LotPK): Required<LotManagementSchema.LotKey> {
    return { resource: 'lot_key', id: pk.id };
  }

  toLot(lot: Lot): Required<LotManagementSchema.Lot> {
    const attributes = this.toAttributes(lot.attributes);

    return {
      resource: 'lot',
      id: lot.primaryKey.id,

      type: lot.type.id,
      offerMaker: this.actorResourceMapper.toOfferMakerKey(lot.offerMaker),
      status: lot.status.id,

      score: lot.score,
      isHot: lot.isHot,

      attributes,
    };
  }

  toAttributes(attributesCollection: AttributeValueListCollection): Required<LotManagementSchema.LotAttributesObject> {
    return {
      // Inputs
      COMMON_PRICE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_PRICE_INPUT), (m) => m.value.toString()),
      COMMON_DIRECTION: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_DIRECTION_INPUT), (m) => m.id),
      COMMON_MEDIATOR: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_MEDIATOR_INPUT), (m) => m.id),
      COMMON_TELEGRAM: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_TELEGRAM_INPUT), (m) => m.value),
      COMMON_DEADLINE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_DEADLINE_INPUT), (m) => m.valueOf()),
      COMMON_ADDITIONAL_INFO: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_ADDITIONAL_INFO_INPUT), (m) => m.value),

      COMMON_OFFER_MAKER_TYPES: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_OFFER_MAKER_TYPES_INPUT), (m) => m.id),
      COMMON_BID_MAKER_TYPES: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_BID_MAKER_TYPES_INPUT), (m) => m.id),
      COMMON_UNITS: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_UNITS_INPUT), (m) => m.value.toString()),
      COMMON_SUMMARY: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_SUMMARY_INPUT), (m) => m.value.toString()),
      COMMON_MIN_FILTER_UNITS: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_MIN_FILTER_UNITS_INPUT), (m) => m.value.toString()),
      COMMON_MIN_FILTER_SUMMARY: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_MIN_FILTER_SUMMARY_INPUT), (m) => m.value.toString()),
      COMMON_BADGE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.COMMON_BADGE_INPUT), (m) => m.id),

      INVEST_DOC_ASSET_PK: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_ASSET_PK_INPUT), (m) => m.id),
      INVEST_DOC_ASSET_CREATE_REQUEST: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT), (m) => ({
        title: m.title,
        website: m.site,
        pitchDeck: m.pitchDeck,
        tokenomics: m.tokenomics,
      })),
      INVEST_DOC_REASSIGNMENT_TYPE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_REASSIGNMENT_TYPE_INPUT), (m) => m.id),
      INVEST_DOC_FDV: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_FDV_INPUT), (m) => m.value.toString()),
      INVEST_DOC_SHARE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_SHARE_INPUT), (m) => m.value.toNumber()),

      INVEST_DOC_ROUND_TYPE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_ROUND_TYPE_INPUT), (m) => m.id),
      INVEST_DOC_ROUND_PRICE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_ROUND_PRICE_INPUT), (m) => m.value.toString()),
      INVEST_DOC_ROUND_UNITS: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_ROUND_UNITS_INPUT), (m) => m.value.toString()),
      INVEST_DOC_ROUND_FDV: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_ROUND_FDV_INPUT), (m) => m.value.toString()),
      INVEST_DOC_ROUND_SHARE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_ROUND_SHARE_INPUT), (m) => m.value.toNumber()),
      INVEST_DOC_ROUND_SUMMARY: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.INVEST_DOC_ROUND_SUMMARY_INPUT), (m) => m.value.toString()),

      SAFE_WITH_TOKEN_WARRANT: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.SAFE_WITH_TOKEN_WARRANT_INPUT)),

      TOKEN_TGE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.TOKEN_TGE_INPUT), (m) => (m.isTBD ? 'TBD' : NullableObject.mapUndefined(m.date, (k) => k.valueOf()))),
      TOKEN_LOCKUP_PERIOD: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.TOKEN_LOCKUP_PERIOD_INPUT), (m) => (m.isOver ? 'OVER' : NullableObject.mapUndefined(m.period))),
      TOKEN_VESTING_PERIOD: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.TOKEN_VESTING_PERIOD_INPUT), (m) => m.value),

      // Attributes
      COMMON_CREATED_AT_ATTRIBUTE: NullableObject.mapUndefined(attributesCollection.findValue(LotAttributes.COMMON_CREATED_AT_ATTRIBUTE), (m) => m.valueOf()),
      COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE: NullableObject.mapUndefined(attributesCollection.findValue(LotAttributes.COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE), (m) => m.valueOf()),
      COMMON_PUBLISHED_AT_ATTRIBUTE: NullableObject.mapUndefined(attributesCollection.findValue(LotAttributes.COMMON_PUBLISHED_AT_ATTRIBUTE), (m) => m.valueOf()),
      COMMON_ARCHIVED_AT_ATTRIBUTE: NullableObject.mapUndefined(attributesCollection.findValue(LotAttributes.COMMON_ARCHIVED_AT_ATTRIBUTE), (m) => m.valueOf()),
      COMMON_COMPLETED_AT_ATTRIBUTE: NullableObject.mapUndefined(attributesCollection.findValue(LotAttributes.COMMON_COMPLETED_AT_ATTRIBUTE), (m) => m.valueOf()),
      COMMON_COMPLETED_REASON_ATTRIBUTE: NullableObject.mapUndefined(attributesCollection.findValue(LotAttributes.COMMON_COMPLETED_REASON_ATTRIBUTE), (m) => m.id),
      COMMON_REJECTED_AT_ATTRIBUTE: NullableObject.mapUndefined(attributesCollection.findValue(LotAttributes.COMMON_REJECTED_AT_ATTRIBUTE), (m) => m.valueOf()),
      COMMON_REJECT_REASON_ATTRIBUTE: NullableObject.mapUndefined(attributesCollection.findValue(LotAttributes.COMMON_REJECT_REASON_ATTRIBUTE), (m) => m.id),

      BOOSTER_INFO_ROUND_TYPE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.BOOSTER_INFO_ROUND_TYPE_INPUT), (m) => m.id),
      BOOSTER_INFO_FDV: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.BOOSTER_INFO_FDV_INPUT), (m) => m.value.toString()),
      BOOSTER_INFO_ROUND_PRICE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.BOOSTER_INFO_ROUND_PRICE_INPUT), (m) => m.value.toString()),
      BOOSTER_INFO_PREVIOUS_ROUND_PRICE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.BOOSTER_INFO_PREVIOUS_ROUND_PRICE_INPUT), (m) => m.value.toString()),
      BOOSTER_INFO_FUTURE_ROUND_PRICE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.BOOSTER_INFO_FUTURE_ROUND_PRICE_INPUT), (m) => m.value.toString()),
      BOOSTER_INFO_LISTING_TIMELINE: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.BOOSTER_INFO_LISTING_TIMELINE_INPUT), (m) => m.valueOf()),
      BOOSTER_INFO_ADDITIONAL_INFO: NullableObject.mapUndefined(attributesCollection.findValue(LotInputs.BOOSTER_INFO_ADDITIONAL_INFO_INPUT), (m) => m.value),
    };
  }

  toProductAssetCreateRequest(value: LotAssetRequest): Required<LotManagementSchema.LotAssetRequest> {
    return {
      title: value.title,
      website: value.site,
      pitchDeck: value.pitchDeck,
      tokenomics: value.tokenomics,
    };
  }

  toLotTotalBidsCountAggregation(value: LotTotalBidsCountAggregatorResult): Required<LotManagementSchema.LotTotalBidsCountAggregation> {
    return {
      resource: 'lot_total_bids_count_aggregation',
      primaryKey: this.toLotKey(value.primaryKey),
      count: value.count,
    };
  }

  toLotTransactionStatsAggregation(value: LotTransactionStatsAggregatorResult): Required<LotManagementSchema.LotTransactionStatsAggregation> {
    return {
      resource: 'lot_transaction_stats_aggregation',
      primaryKey: this.toLotKey(value.primaryKey),
      executed: value.executed.toString(),
      reserved: value.reserved.toString(),
      available: value.available.toString(),
      total: value.total.toString(),
    };
  }

  toLotViewCountAggregation(value: LotViewCountAggregatorResult): Required<LotManagementSchema.LotViewCountAggregation> {
    return {
      resource: 'lot_view_count_aggregation',
      primaryKey: this.toLotKey(value.primaryKey),
      count: value.count,
    };
  }
}
