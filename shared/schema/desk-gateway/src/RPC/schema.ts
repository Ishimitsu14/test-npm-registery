import * as DTO from './DTO';

export type Schema = {
  feedback: {
    create(payload: DTO.FeedbackCreatePayload): DTO.FeedbackCreateResult;
  };
  account: {
    me(payload: DTO.AccountMePayload): DTO.AccountMeResult;
    saveProfile(payload: DTO.AccountSaveProfile.Payload): DTO.AccountSaveProfile.Result;
  };
  asset: {
    getById(payload: DTO.AssetGetByIdPayload): DTO.AssetGetByIdResult;
    list(payload: DTO.AssetListPayload): DTO.AssetListResult;
  };
  auth: {
    signIn(payload: DTO.AuthSignInPayload): DTO.AuthSignInResult;
    generateMessage(payload: DTO.AuthGenerateMessagePayload): DTO.AuthGenerateMessageResult;
    generateTelegramCode(payload: DTO.AuthGenerateTelegramCodePayload): DTO.AuthGenerateTelegramCodeResult;
    telegramCheckSignIn(payload: DTO.AuthTelegramCheckSignInPayload): DTO.AuthTelegramCheckSignInResult;
    telegramVerifyWebApp(payload: DTO.AuthTelegramVerifyWebAppPayload): DTO.AuthTelegramVerifyWebAppResult;
  };
  bid: {
    create(payload: DTO.BidCreatePayload): DTO.BidCreateResult;
    list(payload: DTO.BidListPayload): DTO.BidListResult;
    accept(payload: DTO.BidAcceptPayload): DTO.BidAcceptResult;
    reject(payload: DTO.BidRejectPayload): DTO.BidRejectResult;
    makeActive(payload: DTO.BidMakeActivePayload): DTO.BidMakeActiveResult;
  };
  deal: {
    getById(payload: DTO.DealGetByIdPayload): DTO.DealGetByIdResult;
    list(payload: DTO.DealList.Payload): DTO.DealList.Result;
  };
  lot: {
    archive(payload: DTO.LotArchivePayload): DTO.LotArchiveResult;
    cancelModeration(payload: DTO.LotCancelModerationPayload): DTO.LotCancelModerationResult;
    complete(payload: DTO.LotCompletePayload): DTO.LotCompleteResult;
    create(payload: DTO.LotCreatePayload): DTO.LotCreateResult;
    duplicate(payload: DTO.LotDuplicatePayload): DTO.LotDuplicateResult;
    getById(payload: DTO.LotGetByIdPayload): DTO.LotGetByIdResult;
    list(payload: DTO.LotListPayload): DTO.LotListResult;
    sendOnModeration(payload: DTO.LotSendOnModeration.Payload): DTO.LotSendOnModeration.Result;
    update(payload: DTO.LotUpdate.Payload): DTO.LotUpdate.Result;
    getUploadPitchDeckURL(payload: DTO.LotGetUploadPitchDeckURLPayload): DTO.LotGetUploadPitchDeckURLResult;
    getUploadTokenomicsURL(payload: DTO.LotGetUploadTokenomicsURLPayload): DTO.LotGetUploadTokenomicsURLResult;
  };
  system: {
    getVersion(payload: DTO.SystemGetVersion.Payload): DTO.SystemGetVersion.Result;
  };
  user: {
    updateProfile(payload: DTO.UserProfileUpdate.Payload): DTO.UserProfileUpdate.Result;
  };
  notification: {
    getById(payload: DTO.NotificationGetById.Payload): DTO.NotificationGetById.Result;
    list(payload: DTO.NotificationList.Payload): DTO.NotificationList.Result;
    makeRead(payload: DTO.NotificationMakeRead.Payload): DTO.NotificationMakeRead.Result;
  };
  notificationConfig: {
    get(payload: DTO.NotificationConfigGet.Payload): DTO.NotificationConfigGet.Result;
    update(payload: DTO.NotificationConfigUpdate.Payload): DTO.NotificationConfigUpdate.Result;
  };
  favoriteLot: {
    create(payload: DTO.FavoriteLotCreatePayload): DTO.FavoriteLotCreateResult;
    delete(payload: DTO.FavoriteLotDeletePayload): DTO.FavoriteLotDeleteResult;
    list(payload: DTO.FavoriteLotListPayload): DTO.FavoriteLotListResult;
  };
  viewLot: {
    create(payload: DTO.ViewLotCreate.Payload): DTO.ViewLotCreate.Result;
    getByLotId(payload: DTO.ViewLotGetByLotId.Payload): DTO.ViewLotGetByLotId.Result;
  };
  sumsub: {
    generateVerificationLink(payload: DTO.SumsubGenerateVerificationLink.Payload): DTO.SumsubGenerateVerificationLink.Result;
  };
  file: {
    getById(payload: DTO.FileGetByIdPayload): DTO.FileGetByIdResult;
  };
  lotQuestion: {
    create(payload: DTO.LotQuestionCreate.Payload): DTO.LotQuestionCreate.Result;
    list(payload: DTO.LotQuestionList.Payload): DTO.LotQuestionList.Result;
  };
};
