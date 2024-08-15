import * as DTO from './DTO';
export type Schema = {
    account: {
        me(payload: DTO.AccountMePayload): DTO.AccountMeResult;
    };
    asset: {
        create(payload: DTO.AssetCreatePayload): DTO.AssetCreateResult;
        getById(payload: DTO.AssetGetByIdPayload): DTO.AssetGetByIdResult;
        getUploadAnalyticURL(payload: DTO.AssetGetUploadAnalyticURLPayload): DTO.AssetGetUploadAnalyticURLResult;
        getUploadLogoURL(payload: DTO.AssetGetUploadLogoURLPayload): DTO.AssetGetUploadLogoURLResult;
        list(payload: DTO.AssetListPayload): DTO.AssetListResult;
        update(payload: DTO.AssetUpdatePayload): DTO.AssetUpdateResult;
        resolve(payload: DTO.AssetResolvePayload): DTO.AssetResolveResult;
        makeActive(payload: DTO.AssetMakeActivePayload): DTO.AssetMakeActiveResult;
        archive(payload: DTO.AssetArchivePayload): DTO.AssetArchiveResult;
    };
    assetFaq: {
        create(payload: DTO.AssetFaqCreatePayload): DTO.AssetFaqCreateResult;
        getById(payload: DTO.AssetFaqGetByIdPayload): DTO.AssetFaqGetByIdResult;
        list(payload: DTO.AssetFaqListPayload): DTO.AssetFaqListResult;
        update(payload: DTO.AssetFaqUpdatePayload): DTO.AssetFaqUpdateResult;
        delete(payload: DTO.AssetFaqDeletePayload): DTO.AssetFaqDeleteResult;
    };
    auth: {
        generateMessage(payload: DTO.AuthGenerateMessagePayload): DTO.AuthGenerateMessageResult;
        signIn(payload: DTO.AuthSignInPayload): DTO.AuthSignInResult;
    };
    bid: {
        getById(payload: DTO.BidGetByIdPayload): DTO.BidGetByIdResult;
        list(payload: DTO.BidListPayload): DTO.BidListResult;
        makeActive(payload: DTO.BidMakeActivePayload): DTO.BidMakeActiveResult;
        archive(payload: DTO.BidArchivePayload): DTO.BidArchiveResult;
        update(payload: DTO.BidUpdatePayload): DTO.BidUpdateResult;
        reject(payload: DTO.BidRejectPayload): DTO.BidRejectResult;
    };
    deal: {
        complete(payload: DTO.DealCompletePayload): DTO.DealCompleteResult;
        list(payload: DTO.DealListPayload): DTO.DealListResult;
        getById(payload: DTO.DealGetByIdPayload): DTO.DealGetByIdResult;
        reject(payload: DTO.DealRejectPayload): DTO.DealRejectResult;
        updateKeyResult(payload: DTO.DealUpdateKeyResultPayload): DTO.DealUpdateKeyResultResult;
    };
    lot: {
        archive(payload: DTO.LotArchivePayload): DTO.LotArchiveResult;
        create(payload: DTO.LotCreatePayload): DTO.LotCreateResult;
        getById(payload: DTO.LotGetByIdPayload): DTO.LotGetByIdResult;
        update(payload: DTO.LotUpdatePayload): DTO.LotUpdateResult;
        list(payload: DTO.LotListPayload): DTO.LotListResult;
        makeActive(payload: DTO.LotMakeActivePayload): DTO.LotMakeActiveResult;
        reject(payload: DTO.LotRejectPayload): DTO.LotRejectResult;
    };
    lotBadge: {
        create(payload: DTO.LotBadgeCreatePayload): DTO.LotBadgeCreateResult;
        list(payload: DTO.LotBadgeListPayload): DTO.LotBadgeListResult;
    };
    note: {
        create(payload: DTO.NoteCreatePayload): DTO.NoteCreateResult;
        update(payload: DTO.NoteUpdatePayload): DTO.NoteUpdateResult;
        getById(payload: DTO.NoteGetByIdPayload): DTO.NoteGetByIdResult;
        list(payload: DTO.NoteListPayload): DTO.NoteListResult;
        remove(payload: DTO.NoteRemovePayload): DTO.NoteRemoveResult;
    };
    system: {
        getVersion(payload: DTO.SystemGetVersionPayload): DTO.SystemGetVersionResult;
    };
    user: {
        getById(payload: DTO.UserGetByIdPayload): DTO.UserGetByIdResult;
        list(payload: DTO.UserListPayload): DTO.UserListResult;
    };
    userRole: {
        create(payload: DTO.UserRoleCreatePayload): DTO.UserRoleCreateResult;
        delete(payload: DTO.UserRoleDeletePayload): DTO.UserRoleDeleteResult;
    };
    notification: {
        getById(payload: DTO.NotificationGetByIdPayload): DTO.NotificationGetByIdResult;
        list(payload: DTO.NotificationListPayload): DTO.NotificationListResult;
        makeRead(payload: DTO.NotificationMakeRead.Payload): DTO.NotificationMakeRead.Result;
    };
    feedback: {
        getById(payload: DTO.FeedbackGetByIdPayload): DTO.FeedbackGetByIdResult;
        list(payload: DTO.FeedbackListPayload): DTO.FeedbackListResult;
    };
    lotQuestion: {
        list(payload: DTO.LotQuestionListPayload): DTO.LotQuestionListResult;
        approve(payload: DTO.LotQuestionApprovePayload): DTO.LotQuestionApproveResult;
        reject(payload: DTO.LotQuestionRejectPayload): DTO.LotQuestionRejectResult;
    };
};
