import { User } from '../../Resource';

export namespace AuthTelegramVerifyWebApp {
  export type Payload = {
    username: string;
    hash: string;
    checkDataString: string;
  };

  export type Result = User;
}
