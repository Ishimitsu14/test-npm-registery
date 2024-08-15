import { ModuleMetadata } from '@nestjs/common';

import { NoteResourceMapper } from './NoteResourceMapper';

export const RESOURCE_MAPPERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [NoteResourceMapper];
