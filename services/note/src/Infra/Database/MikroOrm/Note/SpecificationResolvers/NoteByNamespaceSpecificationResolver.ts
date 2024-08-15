import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { NoteByNamespaceSpecification } from '../../../../../Domain';
import { NoteSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(NoteByNamespaceSpecification)
export class NoteByNamespaceSpecificationResolver extends MikroOrmSpecificationResolver<NoteByNamespaceSpecification, NoteSnapshot> {
  setup() {
    this.addWhere(async (spec) => ({
      namespace: {
        $in: spec.namespaces.map((m) => m),
      },
    }));
  }
}
