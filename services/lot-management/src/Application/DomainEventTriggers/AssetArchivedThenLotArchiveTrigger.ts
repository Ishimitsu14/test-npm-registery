import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Query } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';

import { AssetArchivedEvent, Lot, LotByAssetSpecification } from '../../Domain';
import { LOT_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

@RegisterDomainEventTrigger(AssetArchivedEvent)
export class AssetArchivedThenLotArchiveTrigger implements IDomainEventTrigger<AssetArchivedEvent> {
  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  async execute(event: AssetArchivedEvent): Promise<void> {
    const lotRepository = await this.lotRepository();

    const query = Query.create(Lot).addSpecification(new LotByAssetSpecification([event.asset]));

    const lots = await lotRepository.find(query);

    lots.items.forEach((lot) => {
      lot.archive();
      lotRepository.update(lot);
    });
  }
}
