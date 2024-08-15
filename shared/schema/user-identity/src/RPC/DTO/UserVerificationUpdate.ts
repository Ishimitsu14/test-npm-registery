export namespace UserVerificationUpdate {
  export type Payload = {
    userId: string;
    isVerified: boolean;
  };

  export type Result = void;
}
