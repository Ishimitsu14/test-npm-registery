import { ModuleMetadata } from '@nestjs/common';

import { NoteController } from './NoteController';

export const PRESENTATION_INJECT_CONTROLLERS: ModuleMetadata['controllers'] = [NoteController];
