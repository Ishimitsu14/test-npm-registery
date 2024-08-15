export namespace AuthSignInWithTelegram {
  export type Payload = {
    code: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  export type Result = void;
}
