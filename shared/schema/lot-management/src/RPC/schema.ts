import * as DTO from './DTO';

export type Schema = {
  assetCreateRequest: {
    getById(payload: DTO.AssetCreateRequestGetById.Payload): DTO.AssetCreateRequestGetById.Result;
    list(payload: DTO.AssetCreateRequestList.Payload): DTO.AssetCreateRequestList.Result;
  };

  asset: {
    create(payload: DTO.AssetCreate.Payload): DTO.AssetCreate.Result;
    getById(payload: DTO.AssetGetById.Payload): DTO.AssetGetById.Result;
    getUploadAnalyticURL(payload: DTO.AssetGetUploadAnalyticURL.Payload): DTO.AssetGetUploadAnalyticURL.Result;
    getUploadLogoURL(payload: DTO.AssetGetUploadLogoURL.Payload): DTO.AssetGetUploadLogoURL.Result;
    list(payload: DTO.AssetList.Payload): DTO.AssetList.Result;
    update(payload: DTO.AssetUpdate.Payload): DTO.AssetUpdate.Result;
    resolve(payload: DTO.AssetResolve.Payload): DTO.AssetResolve.Result;
    makeActive(payload: DTO.AssetMakeActive.Payload): DTO.AssetMakeActive.Result;
    archive(payload: DTO.AssetArchive.Payload): DTO.AssetArchive.Result;
  };

  assetFaq: {
    create(payload: DTO.AssetFaqCreate.Payload): DTO.AssetFaqCreate.Result;
    getById(payload: DTO.AssetFaqGetById.Payload): DTO.AssetFaqGetById.Result;
    list(payload: DTO.AssetFaqList.Payload): DTO.AssetFaqList.Result;
    update(payload: DTO.AssetFaqUpdate.Payload): DTO.AssetFaqUpdate.Result;
    delete(payload: DTO.AssetFaqDelete.Payload): DTO.AssetFaqDelete.Result;
  };

  bid: {
    create(payload: DTO.BidCreate.Payload): DTO.BidCreate.Result;
    update(payload: DTO.BidUpdate.Payload): DTO.BidUpdate.Result;
    list(payload: DTO.BidList.Payload): DTO.BidList.Result;
    getById(payload: DTO.BidGetById.Payload): DTO.BidGetById.Result;
    accept(payload: DTO.BidAccept.Payload): DTO.BidAccept.Result;
    reject(payload: DTO.BidReject.Payload): DTO.BidReject.Result;
    makeActive(payload: DTO.BidMakeActive.Payload): DTO.BidMakeActive.Result;
    archive(payload: DTO.BidArchive.Payload): DTO.BidArchive.Result;
  };

  lot: {
    archive(payload: DTO.LotArchive.Payload): DTO.LotArchive.Result;
    cancelModeration(payload: DTO.LotCancelModeration.Payload): DTO.LotCancelModeration.Result;
    complete(payload: DTO.LotComplete.Payload): DTO.LotComplete.Result;
    create(payload: DTO.LotCreate.Payload): DTO.LotCreate.Result;
    duplicate(payload: DTO.LotDuplicate.Payload): DTO.LotDuplicate.Result;
    getById(payload: DTO.LotGetById.Payload): DTO.LotGetById.Result;
    list(payload: DTO.LotList.Payload): DTO.LotList.Result;
    makeActive(payload: DTO.LotMakeActive.Payload): DTO.LotMakeActive.Result;
    reject(payload: DTO.LotReject.Payload): DTO.LotReject.Result;
    sendOnModeration(payload: DTO.LotSendOnModeration.Payload): DTO.LotSendOnModeration.Result;
    update(payload: DTO.LotUpdate.Payload): DTO.LotUpdate.Result;
    getUploadPitchDeckURL(payload: DTO.LotGetUploadPitchDeckURL.Payload): DTO.LotGetUploadPitchDeckURL.Result;
    getUploadTokenomicsURL(payload: DTO.LotGetUploadTokenomicsURL.Payload): DTO.LotGetUploadTokenomicsURL.Result;
  };

  deal: {
    complete(payload: DTO.DealComplete.Payload): DTO.DealComplete.Result;
    getById(payload: DTO.DealGetById.Payload): DTO.DealGetById.Result;
    list(payload: DTO.DealList.Payload): DTO.DealList.Result;
    reject(payload: DTO.DealReject.Payload): DTO.DealReject.Result;
    updateKeyResult(payload: DTO.DealUpdateKeyResult.Payload): DTO.DealUpdateKeyResult.Result;
  };

  favoriteLot: {
    create(payload: DTO.FavoriteLotCreate.Payload): DTO.FavoriteLotCreate.Result;
    delete(payload: DTO.FavoriteLotDelete.Payload): DTO.FavoriteLotDelete.Result;
    list(payload: DTO.FavoriteLotList.Payload): DTO.FavoriteLotList.Result;
  };

  viewLot: {
    create(payload: DTO.ViewLotCreate.Payload): DTO.ViewLotCreate.Result;
    getByLotId(payload: DTO.ViewLotGetByLotId.Payload): DTO.ViewLotGetByLotId.Result;
  };

  lotBadge: {
    create(payload: DTO.LotBadgeCreate.Payload): DTO.LotBadgeCreate.Result;
    list(payload: DTO.LotBadgeList.Payload): DTO.LotBadgeList.Result;
  };

  lotQuestion: {
    create(payload: DTO.LotQuestionCreate.Payload): DTO.LotQuestionCreate.Result;
    list(payload: DTO.LotQuestionList.Payload): DTO.LotQuestionList.Result;
    approve(payload: DTO.LotQuestionApprove.Payload): DTO.LotQuestionApprove.Result;
    reject(payload: DTO.LotQuestionReject.Payload): DTO.LotQuestionReject.Result;
  };
};
