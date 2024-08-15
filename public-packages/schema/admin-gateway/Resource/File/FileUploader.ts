import { CoreSchema } from '../../../core';
import { FileKey } from './FileKey';

export interface FileUploader extends CoreSchema.Resource<'file_uploader'>, CoreSchema.ResourceOmitName<FileKey> {
  uploadURL: string;
}
