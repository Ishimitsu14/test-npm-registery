import { CoreSchema } from '@schema/core';

export interface OfferMakerKey extends CoreSchema.ResourceKey<'offer_maker'> {
  userId: string;
}
