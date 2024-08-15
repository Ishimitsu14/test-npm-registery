import { AuthGeneratedMessage } from '../../Resource';

export namespace AuthGenerateMessage {
  export type Payload = {
    domain: string;
    uri: string;
    address: string;
  };

  export type Result = AuthGeneratedMessage;
}
