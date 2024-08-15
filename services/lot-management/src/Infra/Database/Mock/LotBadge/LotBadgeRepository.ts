import { MockRepository } from '@shared/db';
import { ILotBadgeRepository, LotBadge, LotBadgePK } from 'services/lot-management/src/Domain';

export class LotBadgeRepository extends MockRepository<LotBadge> implements ILotBadgeRepository {
  readonly EntityType = LotBadge;

  async nextPk(id: string): Promise<LotBadgePK> {
    return LotBadgePK.raw(id);
  }
}
