import { AuthTelegramCode } from '../../Resource';

export namespace AuthTelegramCodeGetByKey {
  export type Payload = {
    code: string;
  };
  export type Result = AuthTelegramCode;
}
