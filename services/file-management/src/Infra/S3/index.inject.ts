import { ModuleMetadata } from '@nestjs/common';
import { FileManagementConfig } from '@shared/config';

import { S3_FILE_STORE } from '../../Application';
import { AWS_INJECT_PROVIDERS, AWSS3Store } from './AWS';
import { MOCK_INJECT_PROVIDERS, MockS3Store } from './Mock';

export const S3_INJECT_PROVIDERS: ModuleMetadata['providers'] = []
  .concat(FileManagementConfig.s3.useMock ? MOCK_INJECT_PROVIDERS : [])
  .concat(!FileManagementConfig.s3.useMock ? AWS_INJECT_PROVIDERS : [])
  .concat({
    provide: S3_FILE_STORE,
    useExisting: FileManagementConfig.s3.useMock ? MockS3Store : AWSS3Store,
  })
  .filter(Boolean);
