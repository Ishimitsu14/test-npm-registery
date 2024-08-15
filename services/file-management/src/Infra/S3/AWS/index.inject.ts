import { S3 } from '@aws-sdk/client-s3';
import { ModuleMetadata } from '@nestjs/common';
import { FileManagementConfig } from '@shared/config';

import { AWSS3Store } from './AWSS3Store';

export const AWS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: S3,
    useFactory: () => {
      return new S3({
        endpoint: FileManagementConfig.s3.endpoint,
        region: 'test',
        forcePathStyle: false,
        credentials: {
          accessKeyId: FileManagementConfig.s3.credentials.key,
          secretAccessKey: FileManagementConfig.s3.credentials.secret,
        },
      });
    },
  },
  AWSS3Store,
];
