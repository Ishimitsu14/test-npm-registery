import { ModuleMetadata } from '@nestjs/common';
import { paths } from '@packages/berish-configurator-env';
import { FileManagementConfig } from '@shared/config';
import { config, S3 } from 'mock-aws-s3';

import { MockS3Store } from './MockS3Store';

config.basePath = paths.appCache;

export const MOCK_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: S3,
    useFactory: () => {
      return new S3({
        endpoint: FileManagementConfig.s3.endpoint,
        region: 'test',
      });
    },
  },
  MockS3Store,
];
