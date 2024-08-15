import { ModuleMetadata } from '@nestjs/common';
import { mockInject } from '@shared/db';

import { FILE_ENTITY_INJECT_PROVIDERS } from './FileEntity';

export const MOCK_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...mockInject(), ...FILE_ENTITY_INJECT_PROVIDERS];
