import { ModuleMetadata, Scope } from '@nestjs/common';

import { NOTE_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { NoteRepository } from './NoteRepository';
import { SORTABLE_RESOLVERS_INJECT_PROVIDERS } from './SortableResolvers';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const NOTE_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SORTABLE_RESOLVERS_INJECT_PROVIDERS,
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: NOTE_REPOSITORY_INJECT_TOKEN,
    useClass: NoteRepository,
    scope: Scope.REQUEST,
  },
];
