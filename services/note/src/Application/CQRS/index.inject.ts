import { ModuleMetadata } from '@nestjs/common';

import { NoteCreateCommand } from './NoteCreateCommand';
import { NoteGetByIdQuery } from './NoteGetByIdQuery';
import { NoteListQuery } from './NoteListQuery';
import { NoteRemoveCommand } from './NoteRemoveCommand';
import { NoteUpdateCommand } from './NoteUpdateCommand';

export const CQRS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [NoteCreateCommand, NoteUpdateCommand, NoteRemoveCommand, NoteGetByIdQuery, NoteListQuery];
