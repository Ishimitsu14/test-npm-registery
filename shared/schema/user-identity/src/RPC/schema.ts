import * as DTO from './DTO';

export type Schema = {
  auth: {
    signIn(payload: DTO.AuthSignIn.Payload): DTO.AuthSignIn.Result;
    signInWithTelegram(payload: DTO.AuthSignInWithTelegram.Payload): DTO.AuthSignInWithTelegram.Result;
    generateMessage(payload: DTO.AuthGenerateMessage.Payload): DTO.AuthGenerateMessage.Result;
    generateTelegramCode(payload: DTO.AuthGenerateTelegramCode.Payload): DTO.AuthGenerateTelegramCode.Result;
    telegramCodeByKey(payload: DTO.AuthTelegramCodeGetByKey.Payload): DTO.AuthTelegramCodeGetByKey.Result;
    telegramVerifyWebApp(payload: DTO.AuthTelegramVerifyWebApp.Payload): DTO.AuthTelegramVerifyWebApp.Result;
    validateUserByTelegramCode(payload: DTO.AuthValidateUserByTelegramCode.Payload): DTO.AuthValidateUserByTelegramCode.Result;
  };
  user: {
    getByKey(payload: DTO.UserGetByKey.Payload): DTO.UserGetByKey.Result;
    list(payload: DTO.UserList.Payload): DTO.UserList.Result;
    updateProfile(payload: DTO.UserProfileUpdate.Payload): DTO.UserProfileUpdate.Result;
    updateVerification(payload: DTO.UserVerificationUpdate.Payload): DTO.UserVerificationUpdate.Result;
  };
  userRole: {
    create(payload: DTO.UserRoleCreate.Payload): DTO.UserRoleCreate.Result;
    delete(payload: DTO.UserRoleDelete.Payload): DTO.UserRoleDelete.Result;
  };
  sumsub: {
    generateVerificationLink(payload: DTO.SumsubGenerateVerificationLink.Payload): DTO.SumsubGenerateVerificationLink.Result;
  };
};
