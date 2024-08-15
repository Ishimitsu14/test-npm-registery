import { CoreSchema } from '@schema/core';

import { FileAccessMode, FileStatus, FileType } from './Enums';
import { FileKey } from './FileKey';

export interface File extends CoreSchema.Resource<'file', FileKey> {
  createdAt: number;
  status: FileStatus;
  type: FileType;
  mimeType: string;
  mode: FileAccessMode;
  originalName: string;
  size: number;
  url: string;
}
