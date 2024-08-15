import { ModuleMetadata } from '@nestjs/common';

import { FileGet, FileGetUploadURL, FileList } from './File';
import { FileDownload, FileUpload } from './Raw';

export const CQRS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [FileGet, FileUpload, FileDownload, FileList, FileGetUploadURL];
