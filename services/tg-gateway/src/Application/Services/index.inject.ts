import { ModuleMetadata } from '@nestjs/common';

import { AuthService } from './AuthService';

export const SERVICES_INJECT_PROVIDERS: ModuleMetadata['providers'] = [AuthService];
