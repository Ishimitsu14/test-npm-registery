import { NullableObject } from '@ddd/core';
import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotByInvestDocFdvSpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByInvestDocFdvSpecification)
export class LotByInvestDocFdvSpecificationResolver extends MikroOrmSpecificationResolver<LotByInvestDocFdvSpecification, LotSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => {
      if (NullableObject.hasValue(spec.max) && NullableObject.hasValue(spec.min))
        return {
          attributes: {
            investDocFdv: {
              $gte: spec.min.toString(),
              $lte: spec.max.toString(),
            },
          },
        };

      if (NullableObject.hasValue(spec.max))
        return {
          attributes: {
            investDocFdv: {
              $lte: spec.max.toString(),
            },
          },
        };
      if (NullableObject.hasValue(spec.min))
        return {
          attributes: {
            investDocFdv: {
              $gte: spec.min.toString(),
            },
          },
        };

      return {};
    });
  }
}
