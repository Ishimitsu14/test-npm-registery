import { CommonSchema } from '@schema/common';

export namespace UserProfileUpdate {
  export type Payload = {
    userId: string;
    firstName?: string;
    lastName?: string;
    telegram?: string;
    email?: string;
    location?: CommonSchema.Country;
  };
  export type Result = void;
}
