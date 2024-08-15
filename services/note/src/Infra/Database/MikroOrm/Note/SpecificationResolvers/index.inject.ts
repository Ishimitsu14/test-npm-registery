import { ModuleMetadata } from '@nestjs/common';

import { NoteByEntityPkSpecificationResolver } from './NoteByEntityPkSpecificationResolver';
import { NoteByEntitySpecificationResolver } from './NoteByEntitySpecificationResolver';
import { NoteByNamespaceSpecificationResolver } from './NoteByNamespaceSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [NoteByEntityPkSpecificationResolver, NoteByEntitySpecificationResolver, NoteByNamespaceSpecificationResolver];
