import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';
import { USER_ROLE_REPOSITORY_INJECT_TOKEN } from 'services/user-identity/src/Application';

import { UserByRoleSpecification, UserRole } from '../../../../../Domain';

@RegisterSpecificationResolver(UserByRoleSpecification)
export class UserByRoleSpecificationResolver extends MockSpecificationResolver<UserByRoleSpecification> {
  @InjectContext(USER_ROLE_REPOSITORY_INJECT_TOKEN)
  private userRoleRepository: InjectContext<USER_ROLE_REPOSITORY_INJECT_TOKEN>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      const userRoleRepository = await this.userRoleRepository();
      if (Array.isArray(spec.roles)) return async (entities) => entities.filter((entity) => spec.isSatisfied(entity));

      const rolesResult = await userRoleRepository.find(Query.create(UserRole).addSpecification(spec.roles));

      return async (entities) => {
        const roles = rolesResult.items;
        const spec = new UserByRoleSpecification(roles);

        return entities.filter((entity) => spec.isSatisfied(entity));
      };
    });
  }
}
