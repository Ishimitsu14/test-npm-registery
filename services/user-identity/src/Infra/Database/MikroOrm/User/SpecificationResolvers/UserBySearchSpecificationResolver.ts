import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { UserBySearchSpecification } from '../../../../../Domain';
import { UserSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(UserBySearchSpecification)
export class UserBySearchSpecificationResolver extends MikroOrmSpecificationResolver<UserBySearchSpecification, UserSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      profile: {
        $or: ['telegram', 'firstName', 'lastName'].map((field) => ({ [field]: { $ilike: `%${spec.search.toLowerCase()}%` } })),
      },
    }));
  }
}
