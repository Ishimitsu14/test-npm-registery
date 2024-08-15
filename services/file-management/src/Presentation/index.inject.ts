import { ModuleMetadata } from '@nestjs/common';

import { FileRestController, FileRpcController } from './Controllers';

export const PRESENTATION_INJECT_CONTROLLERS: ModuleMetadata['controllers'] = [FileRestController, FileRpcController];
