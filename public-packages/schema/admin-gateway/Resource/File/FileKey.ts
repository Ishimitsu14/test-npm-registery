import { CoreSchema } from '../../../core';

export interface FileKey extends CoreSchema.ResourceKey<'file'> {
  id: string;
}
