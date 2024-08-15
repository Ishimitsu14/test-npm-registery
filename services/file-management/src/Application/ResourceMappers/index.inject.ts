import { ModuleMetadata } from '@nestjs/common';

import { CommonResourceMapper } from './CommonResourceMapper';
import { FileResourceMapper } from './FileResourceMapper';

export const RESOURCE_MAPPERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [CommonResourceMapper, FileResourceMapper];
