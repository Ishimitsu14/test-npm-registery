import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { NoteByEntityPkSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(NoteByEntityPkSpecification)
export class NoteByEntityPkSpecificationResolver extends MockSpecificationResolver<NoteByEntityPkSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
