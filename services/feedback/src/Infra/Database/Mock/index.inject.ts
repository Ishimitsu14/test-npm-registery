import { ModuleMetadata } from '@nestjs/common';
import { mockInject } from '@shared/db';

import { FEEDBACK_INJECT_PROVIDERS } from './Feedback';

export const MOCK_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...mockInject(), ...FEEDBACK_INJECT_PROVIDERS];
