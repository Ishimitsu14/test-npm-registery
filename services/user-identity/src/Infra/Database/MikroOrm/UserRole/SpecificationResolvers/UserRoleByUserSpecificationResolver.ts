import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { UserRoleByUserSpecification } from '../../../../../Domain';
import { UserRepository } from '../../User';
import { UserRoleSnapshot } from '../Snapshots';
import { USER_REPOSITORY_INJECT_TOKEN } from './../../../../../Application/InjectTokens/Repositories';

@RegisterSpecificationResolver(UserRoleByUserSpecification)
export class UserRoleByUserSpecificationResolver extends MikroOrmSpecificationResolver<UserRoleByUserSpecification, UserRoleSnapshot> {
  @InjectContext(forwardRef(() => USER_REPOSITORY_INJECT_TOKEN))
  private userRepository: InjectContext<UserRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const userRepository = await this.userRepository();

      const matchesSpec = Array.isArray(spec.userPKs) ? WhereInPKSpecification.create(spec.userPKs) : spec.userPKs;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, userRepository);
      const queryBuilderSpec = wrapperSpec(userRepository.createEmptyQueryBuilder(userRepository.em));

      return (builder) => {
        return builder.where({
          user: {
            id: {
              $in: queryBuilderSpec.select('id').getKnexQuery(),
            },
          },
        });
      };
    });
  }
}
