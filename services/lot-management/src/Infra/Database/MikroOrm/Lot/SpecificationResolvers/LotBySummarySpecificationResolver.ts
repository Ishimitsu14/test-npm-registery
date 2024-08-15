import { NullableObject } from '@ddd/core';
import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';
import Decimal from 'decimal.js';

import { LotBySummarySpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotBySummarySpecification)
export class LotBySummarySpecificationResolver extends MikroOrmSpecificationResolver<LotBySummarySpecification, LotSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => {
      if (NullableObject.hasValue(spec.max) && NullableObject.hasValue(spec.min))
        return {
          attributes: {
            commonSummary: {
              $gte: new Decimal(spec.min),
              $lte: new Decimal(spec.max),
            },
          },
        };

      if (NullableObject.hasValue(spec.max))
        return {
          attributes: {
            commonSummary: {
              $lte: new Decimal(spec.max),
            },
          },
        };
      if (NullableObject.hasValue(spec.min))
        return {
          attributes: {
            commonSummary: {
              $gte: new Decimal(spec.min),
            },
          },
        };

      return {};
    });
  }
}
