import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { UserByProfileTelegramSpecification } from '../../../../../Domain';
import { UserSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(UserByProfileTelegramSpecification)
export class UserByProfileTelegramSpecificationResolver extends MikroOrmSpecificationResolver<UserByProfileTelegramSpecification, UserSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      profile: {
        telegram: {
          $in: spec.accounts.map((m) => m.value),
        },
      },
    }));
  }
}
