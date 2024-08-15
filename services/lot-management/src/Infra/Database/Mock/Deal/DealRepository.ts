import { MockRepository } from '@shared/db';

import { Deal, IDealRepository } from '../../../../Domain';

export class DealRepository extends MockRepository<Deal> implements IDealRepository {
  readonly EntityType = Deal;
}
