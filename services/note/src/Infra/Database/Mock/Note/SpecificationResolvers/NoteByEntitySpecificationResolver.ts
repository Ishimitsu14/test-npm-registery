import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { NoteByEntitySpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(NoteByEntitySpecification)
export class NoteByEntitySpecificationResolver extends MockSpecificationResolver<NoteByEntitySpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
