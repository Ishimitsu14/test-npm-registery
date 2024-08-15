import { CommonSchema } from '@schema/common';

export namespace UserProfileUpdate {
  export type Payload = {
    firstName?: string;
    lastName?: string;
    telegram?: string;
    email?: string;
    location?: CommonSchema.Country;
  };
  export type Result = void;
}
