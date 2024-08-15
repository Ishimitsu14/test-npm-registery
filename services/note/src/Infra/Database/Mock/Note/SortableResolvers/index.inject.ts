import { ModuleMetadata } from '@nestjs/common';

import { NoteCreatedAtSortableResolver } from './NoteCreatedAtSortableResolver';

export const SORTABLE_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [NoteCreatedAtSortableResolver];
