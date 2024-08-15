import { CoreSchema } from '@schema/core';

export interface AuthGeneratedMessage extends CoreSchema.Resource<'auth_generated_message'> {
  address: string;
  message: string;
  signatureHash: string;
}
