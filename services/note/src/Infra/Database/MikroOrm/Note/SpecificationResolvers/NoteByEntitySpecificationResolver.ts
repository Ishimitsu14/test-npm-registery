import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { NoteByEntitySpecification } from '../../../../../Domain';
import { NoteSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(NoteByEntitySpecification)
export class NoteByEntitySpecificationResolver extends MikroOrmSpecificationResolver<NoteByEntitySpecification, NoteSnapshot> {
  setup() {
    this.addWhere(async (spec) => ({
      entity: {
        $in: spec.entities.map((m) => m),
      },
    }));
  }
}
