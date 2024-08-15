import { ModuleMetadata } from '@nestjs/common';

import { ARTIFACTS_INJECT_PROVIDERS } from './Artifacts';
import { COMPONENTS_INJECT_PROVIDERS } from './Components';

export const CONNECTORS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...ARTIFACTS_INJECT_PROVIDERS, ...COMPONENTS_INJECT_PROVIDERS];
