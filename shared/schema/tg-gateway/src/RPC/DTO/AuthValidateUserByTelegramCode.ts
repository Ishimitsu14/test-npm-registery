import { AuthTelegramCode } from '../../Resource';

export namespace AuthValidateUserByTelegramCode {
  export type Payload = {
    code: string;
    username: string;
  };
  export type Result = AuthTelegramCode;
}
