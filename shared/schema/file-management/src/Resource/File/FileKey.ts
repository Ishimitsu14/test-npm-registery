import { CoreSchema } from '@schema/core';

export interface FileKey extends CoreSchema.ResourceKey<'file'> {
  id: string;
}
