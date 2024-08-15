import { ModuleMetadata } from '@nestjs/common';

import { FILE_HELPER_INJECT_TOKEN } from '../../Application/InjectTokens/DomainResolvers';
import { FileHelper } from './FileHelper';

export const DOMAIN_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: FILE_HELPER_INJECT_TOKEN,
    useClass: FileHelper,
  },
];
