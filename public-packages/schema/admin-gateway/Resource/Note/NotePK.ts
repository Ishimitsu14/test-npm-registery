import { CoreSchema } from '../../../core';

export interface NotePK extends CoreSchema.ResourceKey<'note'> {
  id: string;
}
