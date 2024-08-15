import { CommonSchema } from '@schema/common';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  telegram?: string;
  email?: string;
  location?: CommonSchema.Country;
}
