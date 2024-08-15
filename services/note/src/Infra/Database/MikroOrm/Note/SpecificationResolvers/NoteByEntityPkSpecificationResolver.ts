import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { NoteByEntityPkSpecification } from '../../../../../Domain';
import { NoteSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(NoteByEntityPkSpecification)
export class NoteByEntityPkSpecificationResolver extends MikroOrmSpecificationResolver<NoteByEntityPkSpecification, NoteSnapshot> {
  setup() {
    this.addWhere((spec) => ({
      entityPk: {
        $in: spec.entityPks.map((m) => m),
      },
    }));
  }
}
