import { CoreSchema } from '@schema/core';

export interface NotePK extends CoreSchema.ResourceKey<'note'> {
  id: string;
}
