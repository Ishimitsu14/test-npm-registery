import * as DTO from './DTO';

export type Schema = {
  auth: {
    validateUserByCode(payload: DTO.AuthValidateUserByTelegramCode.Payload): DTO.AuthValidateUserByTelegramCode.Result;
    signIn(payload: DTO.AuthSignInWithTelegram.Payload): DTO.AuthSignInWithTelegram.Result;
  };
};
