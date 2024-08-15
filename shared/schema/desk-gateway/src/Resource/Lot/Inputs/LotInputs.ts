import { Attribute } from '@schema/core';

import { InvestorType, InvestRound, TradeDirection } from '../../Common';
import { LotReassignmentType } from '../Enums';
import { LotAssetRequest } from '../ValueObjects';

export namespace LotInputs {
  export type COMMON_PRICE = Attribute<'COMMON_PRICE', string>;
  export type COMMON_DIRECTION = Attribute<'COMMON_DIRECTION', TradeDirection>;
  export type COMMON_IS_DIRECT = Attribute<'COMMON_IS_DIRECT', boolean>;
  export type COMMON_TELEGRAM = Attribute<'COMMON_TELEGRAM', string>;
  export type COMMON_DEADLINE = Attribute<'COMMON_DEADLINE', number>;
  export type COMMON_ADDITIONAL_INFO = Attribute<'COMMON_ADDITIONAL_INFO', string>;

  export type COMMON_OFFER_MAKER_TYPES = Attribute<'COMMON_OFFER_MAKER_TYPES', InvestorType>;
  export type COMMON_BID_MAKER_TYPES = Attribute<'COMMON_BID_MAKER_TYPES', InvestorType>;
  export type COMMON_UNITS = Attribute<'COMMON_UNITS', string>;
  export type COMMON_SUMMARY = Attribute<'COMMON_SUMMARY', string>;
  export type COMMON_MIN_FILTER_UNITS = Attribute<'COMMON_MIN_FILTER_UNITS', string>;
  export type COMMON_MIN_FILTER_SUMMARY = Attribute<'COMMON_MIN_FILTER_SUMMARY', string>;

  export type COMMON_BADGE = Attribute<'COMMON_BADGE', string>;

  export type INVEST_DOC_ASSET_PK = Attribute<'INVEST_DOC_ASSET_PK', string>;
  export type INVEST_DOC_ASSET_CREATE_REQUEST = Attribute<'INVEST_DOC_ASSET_CREATE_REQUEST', LotAssetRequest>;
  export type INVEST_DOC_REASSIGNMENT_TYPE = Attribute<'INVEST_DOC_REASSIGNMENT_TYPE', LotReassignmentType>;
  export type INVEST_DOC_FDV = Attribute<'INVEST_DOC_FDV', string>;
  export type INVEST_DOC_SHARE = Attribute<'INVEST_DOC_SHARE', number>;

  //  Только при SELL
  export type INVEST_DOC_ROUND_TYPE = Attribute<'INVEST_DOC_ROUND_TYPE', InvestRound>;
  export type INVEST_DOC_ROUND_PRICE = Attribute<'INVEST_DOC_ROUND_PRICE', string>;
  export type INVEST_DOC_ROUND_UNITS = Attribute<'INVEST_DOC_ROUND_UNITS', string>;
  export type INVEST_DOC_ROUND_FDV = Attribute<'INVEST_DOC_ROUND_FDV', string>;
  export type INVEST_DOC_ROUND_SHARE = Attribute<'INVEST_DOC_ROUND_SHARE', number>;
  export type INVEST_DOC_ROUND_SUMMARY = Attribute<'INVEST_DOC_ROUND_SUMMARY', string>;

  export type SAFE_WITH_TOKEN_WARRANT = Attribute<'SAFE_WITH_TOKEN_WARRANT', boolean>;

  export type TOKEN_TGE = Attribute<'TOKEN_TGE', number | 'TBD'>;
  export type TOKEN_LOCKUP_PERIOD = Attribute<'TOKEN_LOCKUP_PERIOD', (string & {}) | 'OVER'>;
  export type TOKEN_VESTING_PERIOD = Attribute<'TOKEN_VESTING_PERIOD', string>;

  // Booster info
  export type BOOSTER_INFO_ROUND_TYPE = Attribute<'BOOSTER_INFO_ROUND_TYPE', InvestRound>;
  export type BOOSTER_INFO_FDV = Attribute<'BOOSTER_INFO_FDV', string>;
  export type BOOSTER_INFO_ROUND_PRICE = Attribute<'BOOSTER_INFO_ROUND_PRICE', string>;
  export type BOOSTER_INFO_PREVIOUS_ROUND_PRICE = Attribute<'BOOSTER_INFO_PREVIOUS_ROUND_PRICE', string>;
  export type BOOSTER_INFO_FUTURE_ROUND_PRICE = Attribute<'BOOSTER_INFO_FUTURE_ROUND_PRICE', string>;
  export type BOOSTER_INFO_LISTING_TIMELINE = Attribute<'BOOSTER_INFO_LISTING_TIMELINE', number>;
  export type BOOSTER_INFO_ADDITIONAL_INFO = Attribute<'BOOSTER_INFO_ADDITIONAL_INFO', string>;
}
