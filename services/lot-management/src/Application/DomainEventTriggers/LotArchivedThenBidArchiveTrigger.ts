import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Query } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';

import { Bid, BidByLotSpecification, LotArchivedEvent } from '../../Domain';
import { BID_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

@RegisterDomainEventTrigger(LotArchivedEvent)
export class LotArchivedThenBidArchiveTrigger implements IDomainEventTrigger<LotArchivedEvent> {
  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  async execute(event: LotArchivedEvent): Promise<void> {
    const bidRepository = await this.bidRepository();

    const query = Query.create(Bid).addSpecification(new BidByLotSpecification([event.lot]));

    const bids = await bidRepository.find(query);

    bids.items.forEach((bid) => {
      bid.archive();
      bidRepository.update(bid);
    });
  }
}
