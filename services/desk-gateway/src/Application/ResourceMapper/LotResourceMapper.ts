import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';

import { AssetResourceMapper } from './AssetResourceMapper';
import { UserResourceMapper } from './UserResourceMapper';

export class LotResourceMapper {
  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  @Inject(AssetResourceMapper)
  private assetResourceMapper: AssetResourceMapper;

  toLotKey(item: LotManagementSchema.LotKey): Required<DeskGatewaySchema.LotKey> {
    return {
      resource: 'lot_key',
      id: item.id,
    };
  }

  toLot(item: LotManagementSchema.Lot): Required<DeskGatewaySchema.Lot> {
    return {
      resource: 'lot',
      id: item.id,

      offerMaker: this.userResourceMapper.toUserKey(item.offerMaker),
      status: item.status,
      type: item.type,

      score: item.score,
      isHot: item.isHot,

      attributes: this.toLotAttributesObject(item.attributes),
    };
  }

  toLotAttributesObject(item: LotManagementSchema.LotAttributesObject): Required<DeskGatewaySchema.LotAttributesObject> {
    const {
      COMMON_PRICE,
      COMMON_DIRECTION,
      COMMON_TELEGRAM,
      COMMON_ADDITIONAL_INFO,
      COMMON_DEADLINE,
      COMMON_OFFER_MAKER_TYPES,
      COMMON_BID_MAKER_TYPES,
      COMMON_UNITS,
      COMMON_SUMMARY,
      COMMON_MIN_FILTER_SUMMARY,
      COMMON_MIN_FILTER_UNITS,
      COMMON_BADGE,
      INVEST_DOC_FDV,
      INVEST_DOC_ASSET_CREATE_REQUEST,
      INVEST_DOC_ASSET_PK,
      INVEST_DOC_ROUND_FDV,
      INVEST_DOC_ROUND_PRICE,
      INVEST_DOC_ROUND_SHARE,
      INVEST_DOC_ROUND_SUMMARY,
      INVEST_DOC_ROUND_TYPE,
      INVEST_DOC_ROUND_UNITS,
      INVEST_DOC_SHARE,
      INVEST_DOC_REASSIGNMENT_TYPE,
      TOKEN_LOCKUP_PERIOD,
      TOKEN_TGE,
      TOKEN_VESTING_PERIOD,
      SAFE_WITH_TOKEN_WARRANT,
      COMMON_ARCHIVED_AT_ATTRIBUTE,
      COMMON_COMPLETED_AT_ATTRIBUTE,
      COMMON_COMPLETED_REASON_ATTRIBUTE,
      COMMON_CREATED_AT_ATTRIBUTE,
      COMMON_MEDIATOR,
      COMMON_PUBLISHED_AT_ATTRIBUTE,
      COMMON_REJECTED_AT_ATTRIBUTE,
      COMMON_REJECT_REASON_ATTRIBUTE,
      COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE,
      BOOSTER_INFO_ROUND_TYPE,
      BOOSTER_INFO_FDV,
      BOOSTER_INFO_ROUND_PRICE,
      BOOSTER_INFO_FUTURE_ROUND_PRICE,
      BOOSTER_INFO_PREVIOUS_ROUND_PRICE,
      BOOSTER_INFO_LISTING_TIMELINE,
      BOOSTER_INFO_ADDITIONAL_INFO,
    } = item;

    return {
      COMMON_PRICE,
      COMMON_DIRECTION,
      COMMON_TELEGRAM,
      COMMON_ADDITIONAL_INFO,
      COMMON_DEADLINE,
      COMMON_OFFER_MAKER_TYPES,
      COMMON_BID_MAKER_TYPES,
      COMMON_UNITS,
      COMMON_SUMMARY,
      COMMON_MIN_FILTER_SUMMARY,
      COMMON_MIN_FILTER_UNITS,
      COMMON_BADGE,
      INVEST_DOC_FDV,
      INVEST_DOC_ASSET_CREATE_REQUEST,
      INVEST_DOC_ASSET_PK,
      INVEST_DOC_ROUND_FDV,
      INVEST_DOC_ROUND_PRICE,
      INVEST_DOC_ROUND_SHARE,
      INVEST_DOC_ROUND_SUMMARY,
      INVEST_DOC_ROUND_TYPE,
      INVEST_DOC_ROUND_UNITS,
      INVEST_DOC_SHARE,
      INVEST_DOC_REASSIGNMENT_TYPE,
      TOKEN_LOCKUP_PERIOD,
      TOKEN_TGE,
      TOKEN_VESTING_PERIOD,
      SAFE_WITH_TOKEN_WARRANT,
      COMMON_ARCHIVED_AT_ATTRIBUTE,
      COMMON_COMPLETED_AT_ATTRIBUTE,
      COMMON_COMPLETED_REASON_ATTRIBUTE,
      COMMON_CREATED_AT_ATTRIBUTE,
      COMMON_PUBLISHED_AT_ATTRIBUTE,
      COMMON_REJECTED_AT_ATTRIBUTE,
      COMMON_REJECT_REASON_ATTRIBUTE,
      COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE,
      COMMON_MEDIATOR,
      COMMON_IS_DIRECT: NullableObject.mapUndefined(COMMON_MEDIATOR, (value) => value === 'DIRECT'),
      BOOSTER_INFO_ROUND_TYPE,
      BOOSTER_INFO_FDV,
      BOOSTER_INFO_ROUND_PRICE,
      BOOSTER_INFO_PREVIOUS_ROUND_PRICE,
      BOOSTER_INFO_FUTURE_ROUND_PRICE,
      BOOSTER_INFO_LISTING_TIMELINE,
      BOOSTER_INFO_ADDITIONAL_INFO,
    };
  }

  toLotTotalBidsCountAggregation(item: LotManagementSchema.LotTotalBidsCountAggregation): Required<DeskGatewaySchema.LotTotalBidsCountAggregation> {
    return {
      resource: 'lot_total_bids_count_aggregation',
      id: item.primaryKey.id,
      count: item.count,
    };
  }

  toLotTransactionStatsAggregation(item: LotManagementSchema.LotTransactionStatsAggregation): Required<DeskGatewaySchema.LotTransactionStatsAggregation> {
    return {
      resource: 'lot_transaction_stats_aggregation',
      id: item.primaryKey.id,
      executed: item.executed,
      reserved: item.reserved,
      available: item.available,
      total: item.total,
    };
  }

  toLotViewCountAggregation(item: LotManagementSchema.LotViewCountAggregation): Required<DeskGatewaySchema.LotViewCountAggregation> {
    return {
      resource: 'lot_view_count_aggregation',
      id: item.primaryKey.id,
      count: item.count,
    };
  }

  fromLotInputObject(inputs: DeskGatewaySchema.LotInputObject): LotManagementSchema.LotInputObject {
    return {
      COMMON_PRICE: inputs.COMMON_PRICE,
      COMMON_DIRECTION: inputs.COMMON_DIRECTION,
      COMMON_MEDIATOR: NullableObject.mapUndefined(inputs.COMMON_IS_DIRECT, (m) => (m ? 'DIRECT' : 'OTC_AGENT')),
      COMMON_TELEGRAM: inputs.COMMON_TELEGRAM,
      COMMON_ADDITIONAL_INFO: inputs.COMMON_ADDITIONAL_INFO,
      COMMON_DEADLINE: inputs.COMMON_DEADLINE,

      COMMON_OFFER_MAKER_TYPES: inputs.COMMON_OFFER_MAKER_TYPES,
      COMMON_BID_MAKER_TYPES: inputs.COMMON_BID_MAKER_TYPES,
      COMMON_UNITS: inputs.COMMON_UNITS,
      COMMON_SUMMARY: inputs.COMMON_SUMMARY,
      COMMON_MIN_FILTER_UNITS: inputs.COMMON_MIN_FILTER_UNITS,
      COMMON_MIN_FILTER_SUMMARY: inputs.COMMON_MIN_FILTER_SUMMARY,

      INVEST_DOC_ASSET_PK: inputs.INVEST_DOC_ASSET_PK,
      INVEST_DOC_ASSET_CREATE_REQUEST: inputs.INVEST_DOC_ASSET_CREATE_REQUEST,
      INVEST_DOC_REASSIGNMENT_TYPE: inputs.INVEST_DOC_REASSIGNMENT_TYPE,
      INVEST_DOC_FDV: inputs.INVEST_DOC_FDV,
      INVEST_DOC_SHARE: inputs.INVEST_DOC_SHARE,

      INVEST_DOC_ROUND_TYPE: inputs.INVEST_DOC_ROUND_TYPE,
      INVEST_DOC_ROUND_PRICE: inputs.INVEST_DOC_ROUND_PRICE,
      INVEST_DOC_ROUND_UNITS: inputs.INVEST_DOC_ROUND_UNITS,
      INVEST_DOC_ROUND_FDV: inputs.INVEST_DOC_ROUND_FDV,
      INVEST_DOC_ROUND_SHARE: inputs.INVEST_DOC_ROUND_SHARE,
      INVEST_DOC_ROUND_SUMMARY: inputs.INVEST_DOC_ROUND_SUMMARY,

      SAFE_WITH_TOKEN_WARRANT: inputs.SAFE_WITH_TOKEN_WARRANT,

      TOKEN_TGE: inputs.TOKEN_TGE,
      TOKEN_LOCKUP_PERIOD: inputs.TOKEN_LOCKUP_PERIOD,
      TOKEN_VESTING_PERIOD: inputs.TOKEN_VESTING_PERIOD,

      BOOSTER_INFO_ROUND_TYPE: inputs.BOOSTER_INFO_ROUND_TYPE,
      BOOSTER_INFO_FDV: inputs.BOOSTER_INFO_FDV,
      BOOSTER_INFO_ROUND_PRICE: inputs.BOOSTER_INFO_ROUND_PRICE,
      BOOSTER_INFO_PREVIOUS_ROUND_PRICE: inputs.BOOSTER_INFO_PREVIOUS_ROUND_PRICE,
      BOOSTER_INFO_FUTURE_ROUND_PRICE: inputs.BOOSTER_INFO_FUTURE_ROUND_PRICE,
      BOOSTER_INFO_LISTING_TIMELINE: inputs.BOOSTER_INFO_LISTING_TIMELINE,
      BOOSTER_INFO_ADDITIONAL_INFO: inputs.BOOSTER_INFO_ADDITIONAL_INFO,
    };
  }

  // toLotInclude(items: CoreSchema.IncludeLink<LotManagementSchema.RPC.DTO.LotList.Include>[]): Required<CoreSchema.IncludeLink<DeskGatewaySchema.RPC.DTO.LotList.Include>>[] {
  //   return items
  //     .map((item) => {
  //       if (item.resource === 'asset') return this.assetResourceMapper.toAsset(item, NullableObject, NullableObject);
  //       if (item.resource === 'asset_lot_stats_aggregation') return this.assetResourceMapper.toAssetIncludeLinks(item);
  //       if (item.resource === 'lot_total_bids_count_aggregation') return this.toLotTotalBidsCountAggregation(item);
  //       if (item.resource === 'lot_transaction_stats_aggregation') return this.toLotTransactionStatsAggregation(item);

  //       return NullableObject;
  //     })
  //     .concat(this.assetResourceMapper.toAssetIncludeLinks(items.))
  //     .filter(NullableObject.hasValue);
  // }
}
