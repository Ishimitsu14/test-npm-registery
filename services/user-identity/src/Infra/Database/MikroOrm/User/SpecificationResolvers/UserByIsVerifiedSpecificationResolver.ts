import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { UserByIsVerifiedSpecification } from '../../../../../Domain';
import { UserSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(UserByIsVerifiedSpecification)
export class UserByIsVerifiedSpecificationResolver extends MikroOrmSpecificationResolver<UserByIsVerifiedSpecification, UserSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => {
      return {
        verification: {
          isVerified: spec.isVerified,
        },
      };
    });
  }
}
