import { ModuleMetadata } from '@nestjs/common';

import { AssetArchive, AssetCreate, AssetGetById, AssetGetUploadAnalyticURL, AssetGetUploadLogoURL, AssetList, AssetMakeActive, AssetResolve, AssetUpdate } from './Asset';
import { AssetFaqCreate, AssetFaqDelete, AssetFaqGetById, AssetFaqList, AssetFaqUpdate } from './AssetFaq';
import { BidAccept, BidArchive, BidCreate, BidGetById, BidList, BidMakeActive, BidReject, BidUpdate } from './Bid';
import { DealComplete, DealGetById, DealList, DealReject, DealUpdateKeyResult } from './Deal';
import { FavoriteLotCreate, FavoriteLotDelete, FavoriteLotList } from './FavoriteLot';
import {
  LotArchive,
  LotCancelModeration,
  LotComplete,
  LotCreate,
  LotDuplicate,
  LotGetById,
  LotGetUploadPitchDeckURL,
  LotGetUploadTokenomicsURL,
  LotList,
  LotMakeActive,
  LotReject,
  LotSendOnModeration,
  LotUpdate,
} from './Lot';
import { LotBadgeCreate, LotBadgeList } from './LotBadge';
import { LotQuestionApprove, LotQuestionCreate, LotQuestionList, LotQuestionReject } from './LotQuestion';
import { ViewLotCreate, ViewLotGetByLotId } from './ViewLot';

export const CQRS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  AssetCreate,
  AssetGetById,
  AssetGetUploadAnalyticURL,
  AssetGetUploadLogoURL,
  AssetList,
  AssetUpdate,
  AssetResolve,
  AssetArchive,
  AssetMakeActive,

  BidAccept,
  BidArchive,
  BidCreate,
  BidUpdate,
  BidGetById,
  BidList,
  BidMakeActive,
  BidReject,

  DealComplete,
  DealGetById,
  DealList,
  DealReject,
  DealUpdateKeyResult,

  LotArchive,
  LotCancelModeration,
  LotComplete,
  LotCreate,
  LotDuplicate,
  LotGetById,
  LotList,
  LotMakeActive,
  LotReject,
  LotSendOnModeration,
  LotUpdate,
  LotGetUploadTokenomicsURL,
  LotGetUploadPitchDeckURL,

  FavoriteLotCreate,
  FavoriteLotList,
  FavoriteLotDelete,

  LotQuestionCreate,
  LotQuestionList,
  LotQuestionApprove,
  LotQuestionReject,

  AssetFaqCreate,
  AssetFaqDelete,
  AssetFaqList,
  AssetFaqGetById,
  AssetFaqUpdate,

  ViewLotCreate,
  ViewLotGetByLotId,

  LotBadgeCreate,
  LotBadgeList,
];
