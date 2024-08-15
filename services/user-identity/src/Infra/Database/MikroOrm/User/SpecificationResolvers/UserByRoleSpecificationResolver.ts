import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { UserByRoleSpecification } from '../../../../../Domain';
import { UserRoleRepository } from '../../UserRole';
import { UserSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(UserByRoleSpecification)
export class UserByRoleSpecificationResolver extends MikroOrmSpecificationResolver<UserByRoleSpecification, UserSnapshot> {
  @InjectContext(forwardRef(() => UserRoleRepository))
  private userRoleRepository: InjectContext<UserRoleRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const userRoleRepository = await this.userRoleRepository();

      const matchesSpec = Array.isArray(spec.roles) ? WhereInPKSpecification.create(spec.roles.map((m) => m.primaryKey)) : spec.roles;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, userRoleRepository);
      const queryBuilderSpec = wrapperSpec(userRoleRepository.createEmptyQueryBuilder(userRoleRepository.em));

      return (builder) => {
        return builder.where({
          roles: {
            $in: queryBuilderSpec.select('id').getKnexQuery(),
          },
        });
      };
    });
  }
}
