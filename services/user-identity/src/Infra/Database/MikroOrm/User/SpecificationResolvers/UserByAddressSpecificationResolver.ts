import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { UserByAddressSpecification } from '../../../../../Domain';
import { UserSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(UserByAddressSpecification)
export class UserByAddressSpecificationResolver extends MikroOrmSpecificationResolver<UserByAddressSpecification, UserSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      auth_data: {
        address: {
          $in: spec.addresses.map((m) => m.value),
        },
      },
    }));
  }
}
