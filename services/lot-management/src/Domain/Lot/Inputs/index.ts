import { AssetPK } from '../../Asset';
import { AdditionalInfo, InvestorType, InvestRound, LockupPeriod, MediatorType, Percent, Price, StablecoinQuantity, Telegram, TGE, TradeDirection, UnitQuantity, VestingPeriod } from '../../Common';
import { LotBadgePK } from '../../LotBadge';
import { Attribute } from '../Abstract';
import { LotReassignmentType } from '../Enums';
import { LotAssetRequest } from '../ValueObjects';

export namespace LotInputs {
  export const COMMON_DIRECTION_INPUT = Attribute.create<TradeDirection>('COMMON_DIRECTION_INPUT');
  export const COMMON_MEDIATOR_INPUT = Attribute.create<MediatorType>('COMMON_MEDIATOR_INPUT');
  export const COMMON_TELEGRAM_INPUT = Attribute.create<Telegram>('COMMON_TELEGRAM_INPUT');
  export const COMMON_DEADLINE_INPUT = Attribute.create<Date>('COMMON_DEADLINE_INPUT');
  export const COMMON_OFFER_MAKER_TYPES_INPUT = Attribute.create<InvestorType>('COMMON_OFFER_MAKER_TYPES_INPUT');
  export const COMMON_BID_MAKER_TYPES_INPUT = Attribute.create<InvestorType>('COMMON_BID_MAKER_TYPES_INPUT');
  export const COMMON_ADDITIONAL_INFO_INPUT = Attribute.create<AdditionalInfo>('COMMON_ADDITIONAL_INFO_INPUT');
  export const COMMON_BADGE_INPUT = Attribute.create<LotBadgePK>('COMMON_BADGE_INPUT');

  export const COMMON_PRICE_INPUT = Attribute.create<Price>('COMMON_PRICE_INPUT');
  export const COMMON_UNITS_INPUT = Attribute.create<UnitQuantity>('COMMON_UNITS_INPUT');
  export const COMMON_SUMMARY_INPUT = Attribute.create<StablecoinQuantity>('COMMON_SUMMARY_INPUT');

  export const COMMON_MIN_FILTER_UNITS_INPUT = Attribute.create<UnitQuantity>('COMMON_MIN_FILTER_UNITS_INPUT');
  export const COMMON_MIN_FILTER_SUMMARY_INPUT = Attribute.create<StablecoinQuantity>('COMMON_MIN_FILTER_SUMMARY_INPUT');

  export const INVEST_DOC_ASSET_PK_INPUT = Attribute.create<AssetPK>('INVEST_DOC_ASSET_PK_INPUT');
  export const INVEST_DOC_ASSET_CREATE_REQUEST_INPUT = Attribute.create<LotAssetRequest>('INVEST_DOC_ASSET_CREATE_REQUEST_INPUT');
  export const INVEST_DOC_REASSIGNMENT_TYPE_INPUT = Attribute.create<LotReassignmentType>('INVEST_DOC_REASSIGNMENT_TYPE_INPUT');
  export const INVEST_DOC_FDV_INPUT = Attribute.create<StablecoinQuantity>('INVEST_DOC_FDV_INPUT');
  export const INVEST_DOC_SHARE_INPUT = Attribute.create<Percent>('INVEST_DOC_SHARE_INPUT');

  export const INVEST_DOC_ROUND_TYPE_INPUT = Attribute.create<InvestRound>('INVEST_DOC_ROUND_TYPE_INPUT');
  export const INVEST_DOC_ROUND_PRICE_INPUT = Attribute.create<Price>('INVEST_DOC_ROUND_PRICE_INPUT');
  export const INVEST_DOC_ROUND_UNITS_INPUT = Attribute.create<UnitQuantity>('INVEST_DOC_ROUND_UNITS_INPUT');
  export const INVEST_DOC_ROUND_FDV_INPUT = Attribute.create<StablecoinQuantity>('INVEST_DOC_ROUND_FDV_INPUT');
  export const INVEST_DOC_ROUND_SHARE_INPUT = Attribute.create<Percent>('INVEST_DOC_ROUND_SHARE_INPUT');
  export const INVEST_DOC_ROUND_SUMMARY_INPUT = Attribute.create<StablecoinQuantity>('INVEST_DOC_ROUND_SUMMARY_INPUT');

  export const SAFE_WITH_TOKEN_WARRANT_INPUT = Attribute.create<boolean>('SAFE_WITH_TOKEN_WARRANT_INPUT');

  export const TOKEN_TGE_INPUT = Attribute.create<TGE>('TOKEN_TGE_INPUT');
  export const TOKEN_LOCKUP_PERIOD_INPUT = Attribute.create<LockupPeriod>('TOKEN_LOCKUP_PERIOD_INPUT');
  export const TOKEN_VESTING_PERIOD_INPUT = Attribute.create<VestingPeriod>('TOKEN_VESTING_PERIOD_INPUT');

  export const BOOSTER_INFO_ROUND_TYPE_INPUT = Attribute.create<InvestRound>('BOOSTER_INFO_ROUND_TYPE_INPUT');
  export const BOOSTER_INFO_FDV_INPUT = Attribute.create<StablecoinQuantity>('BOOSTER_INFO_FDV_INPUT');
  export const BOOSTER_INFO_ROUND_PRICE_INPUT = Attribute.create<Price>('BOOSTER_INFO_ROUND_PRICE_INPUT');
  export const BOOSTER_INFO_PREVIOUS_ROUND_PRICE_INPUT = Attribute.create<Price>('BOOSTER_INFO_PREVIOUS_ROUND_PRICE_INPUT');
  export const BOOSTER_INFO_FUTURE_ROUND_PRICE_INPUT = Attribute.create<Price>('BOOSTER_INFO_FUTURE_ROUND_PRICE_INPUT');
  export const BOOSTER_INFO_LISTING_TIMELINE_INPUT = Attribute.create<Date>('BOOSTER_INFO_LISTING_TIMELINE_INPUT');
  export const BOOSTER_INFO_ADDITIONAL_INFO_INPUT = Attribute.create<AdditionalInfo>('BOOSTER_INFO_ADDITIONAL_INFO_INPUT');
}
