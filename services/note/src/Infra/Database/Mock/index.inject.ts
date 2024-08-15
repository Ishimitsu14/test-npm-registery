import { ModuleMetadata } from '@nestjs/common';
import { mockInject } from '@shared/db';

import { NOTE_INJECT_PROVIDERS } from './Note';

export const MOCK_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...mockInject(), ...NOTE_INJECT_PROVIDERS];
