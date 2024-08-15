import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Query } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';

import { BidArchivedEvent, Deal, DealByBidSpecification } from '../../Domain';
import { DEAL_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

@RegisterDomainEventTrigger(BidArchivedEvent)
export class BidArchivedThenDealRejectTrigger implements IDomainEventTrigger<BidArchivedEvent> {
  @InjectContext(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: InjectContext<DEAL_REPOSITORY_INJECT_TOKEN>;

  async execute(event: BidArchivedEvent): Promise<void> {
    const dealRepository = await this.dealRepository();

    const query = Query.create(Deal).addSpecification(new DealByBidSpecification([event.bid]));

    const deals = await dealRepository.find(query);

    deals.items.forEach((deal) => {
      deal.reject();
      dealRepository.update(deal);
    });
  }
}
