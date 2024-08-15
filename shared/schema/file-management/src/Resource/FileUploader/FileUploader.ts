import { CoreSchema } from '@schema/core';

export interface FileUploader extends CoreSchema.Resource<'file_uploader'> {
  id: string;
  uploadURL: string;
}
