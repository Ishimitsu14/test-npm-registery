import { ModuleMetadata } from '@nestjs/common';

import { FileURLResolver } from './FileURLResolver';

export const HELPERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [FileURLResolver];
