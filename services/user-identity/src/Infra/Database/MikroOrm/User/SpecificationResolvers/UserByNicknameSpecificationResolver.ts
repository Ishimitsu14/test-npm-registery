import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { UserByNicknameSpecification } from '../../../../../Domain';
import { UserSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(UserByNicknameSpecification)
export class UserByNicknameSpecificationResolver extends MikroOrmSpecificationResolver<UserByNicknameSpecification, UserSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => {
      return {
        nickname: {
          $in: spec.nicknames.map((m) => m.value),
        },
      };
    });
  }
}
