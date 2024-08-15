import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { UserByProfileEmailSpecification } from '../../../../../Domain';
import { UserSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(UserByProfileEmailSpecification)
export class UserByProfileEmailSpecificationResolver extends MikroOrmSpecificationResolver<UserByProfileEmailSpecification, UserSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      profile: {
        email: {
          $in: spec.emails.map((m) => m.value),
        },
      },
    }));
  }
}
