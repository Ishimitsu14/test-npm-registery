import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { UserRoleByTypeSpecification } from '../../../../../Domain';
import { UserRoleSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(UserRoleByTypeSpecification)
export class UserRoleByTypeSpecificationResolver extends MikroOrmSpecificationResolver<UserRoleByTypeSpecification, UserRoleSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      type: {
        $in: spec.types.map((t) => t.id),
      },
    }));
  }
}
