import { NullableObject } from '@ddd/core';
import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';
import Decimal from 'decimal.js';

import { LotByMinSummarySpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByMinSummarySpecification)
export class LotByMinSummarySpecificationResolver extends MikroOrmSpecificationResolver<LotByMinSummarySpecification, LotSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => {
      if (NullableObject.hasValue(spec.max) && NullableObject.hasValue(spec.min))
        return {
          attributes: {
            commonMinFilterSummary: {
              $gte: new Decimal(spec.min),
              $lte: new Decimal(spec.max),
            },
          },
        };

      if (NullableObject.hasValue(spec.max))
        return {
          attributes: {
            commonMinFilterSummary: {
              $lte: new Decimal(spec.max),
            },
          },
        };
      if (NullableObject.hasValue(spec.min))
        return {
          attributes: {
            commonMinFilterSummary: {
              $gte: new Decimal(spec.min),
            },
          },
        };

      return {};
    });
  }
}
