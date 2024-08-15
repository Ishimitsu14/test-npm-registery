import { CommonSchema } from '@schema/common';

export interface AccountProfile {
  firstName?: string;
  lastName?: string;
  telegram?: string;
  email?: string;
  location?: CommonSchema.Country;
}
