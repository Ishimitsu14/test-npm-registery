import { IAggregationQueryResolver } from '@ddd/specifications';

import {
  IAssetFaqRepository,
  IAssetRepository,
  IBidRepository,
  IDealRepository,
  IDealTransactionRepository,
  IFavoriteLotRepository,
  ILotBadgeRepository,
  ILotQuestionRepository,
  ILotRepository,
  IViewLotRepository,
} from '../../Domain';

export const ASSET_REPOSITORY_INJECT_TOKEN = Symbol('ASSET_REPOSITORY_INJECT_TOKEN');
export type ASSET_REPOSITORY_INJECT_TOKEN = IAssetRepository;

export const LOT_REPOSITORY_INJECT_TOKEN = Symbol('LOT_REPOSITORY_INJECT_TOKEN');
export type LOT_REPOSITORY_INJECT_TOKEN = ILotRepository;

export const BID_REPOSITORY_INJECT_TOKEN = Symbol('BID_REPOSITORY_INJECT_TOKEN');
export type BID_REPOSITORY_INJECT_TOKEN = IBidRepository;

export const DEAL_REPOSITORY_INJECT_TOKEN = Symbol('DEAL_REPOSITORY_INJECT_TOKEN');
export type DEAL_REPOSITORY_INJECT_TOKEN = IDealRepository;

export const DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN = Symbol('DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN');
export type DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN = IDealTransactionRepository;

export const AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN = Symbol('AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN');
export type AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN = IAggregationQueryResolver;

export const FAVORITE_LOT_REPOSITORY_INJECT_TOKEN = Symbol('FAVORITE_LOT_REPOSITORY_INJECT_TOKEN');
export type FAVORITE_LOT_REPOSITORY_INJECT_TOKEN = IFavoriteLotRepository;

export const VIEW_LOT_REPOSITORY_INJECT_TOKEN = Symbol('VIEW_LOT_REPOSITORY_INJECT_TOKEN');
export type VIEW_LOT_REPOSITORY_INJECT_TOKEN = IViewLotRepository;

export const LOT_QUESTION_REPOSITORY_INJECT_TOKEN = Symbol('LOT_QUESTION_REPOSITORY_INJECT_TOKEN');
export type LOT_QUESTION_REPOSITORY_INJECT_TOKEN = ILotQuestionRepository;

export const ASSET_FAQ_REPOSITORY_INJECT_TOKEN = Symbol('ASSET_FAQ_REPOSITORY_INJECT_TOKEN');
export type ASSET_FAQ_REPOSITORY_INJECT_TOKEN = IAssetFaqRepository;

export const LOT_BADGE_REPOSITORY_INJECT_TOKEN = Symbol('LOT_BADGE_REPOSITORY_INJECT_TOKEN');
export type LOT_BADGE_REPOSITORY_INJECT_TOKEN = ILotBadgeRepository;
