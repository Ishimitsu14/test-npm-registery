import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { InjectContext } from '@packages/nestjs-request-context';

import { DealCreatedEvent, DealTransaction } from '../../Domain';
import { DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

@RegisterDomainEventTrigger(DealCreatedEvent)
export class DealCreatedThenLotTransactionCreateTrigger implements IDomainEventTrigger<DealCreatedEvent> {
  @InjectContext(DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN)
  private dealTransactionRepository: InjectContext<DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN>;

  async execute(event: DealCreatedEvent): Promise<void> {
    const dealTransactionRepository = await this.dealTransactionRepository();

    const dealTransactionPK = dealTransactionRepository.generatePK();
    const dealTransaction = DealTransaction.createReserve(dealTransactionPK, event.deal.primaryKey);

    dealTransactionRepository.add(dealTransaction);
  }
}
