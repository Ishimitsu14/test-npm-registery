import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { NoteByNamespaceSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(NoteByNamespaceSpecification)
export class NoteByNamespaceSpecificationResolver extends MockSpecificationResolver<NoteByNamespaceSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
