import { NullableObject } from '@ddd/core';
import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotByCreatedAtSpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByCreatedAtSpecification)
export class LotByCreatedAtSpecificationResolver extends MikroOrmSpecificationResolver<LotByCreatedAtSpecification, LotSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => {
      if (NullableObject.hasValue(spec.max) && NullableObject.hasValue(spec.min))
        return {
          attributes: {
            commonCreatedAt: {
              $gte: new Date(spec.min),
              $lte: new Date(spec.max),
            },
          },
        };

      if (NullableObject.hasValue(spec.max))
        return {
          attributes: {
            commonCreatedAt: {
              $lte: new Date(spec.max),
            },
          },
        };
      if (NullableObject.hasValue(spec.min))
        return {
          attributes: {
            commonCreatedAt: {
              $gte: new Date(spec.min),
            },
          },
        };

      return {};
    });
  }
}
