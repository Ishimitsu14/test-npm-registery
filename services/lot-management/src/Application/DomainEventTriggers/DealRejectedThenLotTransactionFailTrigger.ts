import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Query } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';

import { DealRejectedEvent, DealTransaction, DealTransactionByDealSpecification } from '../../Domain';
import { DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

@RegisterDomainEventTrigger(DealRejectedEvent)
export class DealRejectedThenLotTransactionFailTrigger implements IDomainEventTrigger<DealRejectedEvent> {
  @InjectContext(DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN)
  private dealTransactionRepository: InjectContext<DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN>;

  async execute(event: DealRejectedEvent): Promise<void> {
    const dealTransactionRepository = await this.dealTransactionRepository();

    const query = Query.create(DealTransaction).addSpecification(new DealTransactionByDealSpecification([event.deal]));

    const dealTransactions = await dealTransactionRepository.find(query);

    dealTransactions.items.forEach((dealTransaction) => {
      dealTransaction.markAsFailed();
      dealTransactionRepository.update(dealTransaction);
    });
  }
}
