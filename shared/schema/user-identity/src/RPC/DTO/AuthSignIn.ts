import { User } from '../../Resource';

export namespace AuthSignIn {
  export type Payload = {
    message: string;
    signatureHash: string;
    signature: string;
  };
  export type Result = User;
}
