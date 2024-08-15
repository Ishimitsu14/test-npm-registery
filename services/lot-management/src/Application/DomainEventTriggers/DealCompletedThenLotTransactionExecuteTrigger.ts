import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Query } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';

import { DealCompletedEvent, DealTransaction, DealTransactionByDealSpecification } from '../../Domain';
import { DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

@RegisterDomainEventTrigger(DealCompletedEvent)
export class DealCompletedThenLotTransactionExecuteTrigger implements IDomainEventTrigger<DealCompletedEvent> {
  @InjectContext(DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN)
  private dealTransactionRepository: InjectContext<DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN>;

  async execute(event: DealCompletedEvent): Promise<void> {
    const dealTransactionRepository = await this.dealTransactionRepository();

    const query = Query.create(DealTransaction).addSpecification(new DealTransactionByDealSpecification([event.deal]));

    const dealTransactions = await dealTransactionRepository.find(query);

    dealTransactions.items.forEach((dealTransaction) => {
      dealTransaction.markAsExecuted();
      dealTransactionRepository.update(dealTransaction);
    });
  }
}
