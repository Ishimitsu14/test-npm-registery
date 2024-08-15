import { createSnapshotFromDomain, ISnapshot } from '@ddd/infra';
import { Embeddable, Embedded } from '@mikro-orm/core';
import { DealKeyResults } from 'services/lot-management/src/Domain';

import {
  AgentCommissionKRSnapshot,
  AgentValidationKRSnapshot,
  AMLValidationKRSnapshot,
  BidMakerValidationKRSnapshot,
  DocumentOwnershipKRSnapshot,
  DocumentResignedKRSnapshot,
  KYBValidationKRSnapshot,
  KYCValidationKRSnapshot,
  MarsbaseCommissionKRSnapshot,
  OfferMakerValidationKRSnapshot,
  TelegramChatKRSnapshot,
  TransactionPaymentKRSnapshot,
} from './KeyResults';

@Embeddable()
export class DealKeyResultsSnapshot implements ISnapshot<DealKeyResults> {
  @Embedded({ entity: () => AgentCommissionKRSnapshot })
  agent_commission: AgentCommissionKRSnapshot;

  @Embedded({ entity: () => AgentValidationKRSnapshot })
  agent_validation: AgentValidationKRSnapshot;

  @Embedded({ entity: () => AMLValidationKRSnapshot })
  aml_validation: AMLValidationKRSnapshot;

  @Embedded({ entity: () => BidMakerValidationKRSnapshot })
  bid_maker_validation: BidMakerValidationKRSnapshot;

  @Embedded({ entity: () => DocumentOwnershipKRSnapshot })
  document_ownership: DocumentOwnershipKRSnapshot;

  @Embedded({ entity: () => DocumentResignedKRSnapshot })
  document_resigned: DocumentResignedKRSnapshot;

  @Embedded({ entity: () => KYBValidationKRSnapshot })
  kyb_validation: KYBValidationKRSnapshot;

  @Embedded({ entity: () => KYCValidationKRSnapshot })
  kyc_validation: KYCValidationKRSnapshot;

  @Embedded({ entity: () => MarsbaseCommissionKRSnapshot })
  marsbase_commission: MarsbaseCommissionKRSnapshot;

  @Embedded({ entity: () => OfferMakerValidationKRSnapshot })
  offer_maker_validation: OfferMakerValidationKRSnapshot;

  @Embedded({ entity: () => TelegramChatKRSnapshot })
  telegram_chat: TelegramChatKRSnapshot;

  @Embedded({ entity: () => TransactionPaymentKRSnapshot })
  transaction_payment: TransactionPaymentKRSnapshot;

  applyDomain(domain: DealKeyResults): void {
    this.agent_commission = createSnapshotFromDomain(AgentCommissionKRSnapshot, domain.state.agentCommissionKR);
    this.agent_validation = createSnapshotFromDomain(AgentValidationKRSnapshot, domain.state.agentValidationKR);
    this.aml_validation = createSnapshotFromDomain(AMLValidationKRSnapshot, domain.state.amlValidationKR);
    this.bid_maker_validation = createSnapshotFromDomain(BidMakerValidationKRSnapshot, domain.state.bidMakerValidationKR);
    this.document_ownership = createSnapshotFromDomain(DocumentOwnershipKRSnapshot, domain.state.documentOwnershipKR);
    this.document_resigned = createSnapshotFromDomain(DocumentResignedKRSnapshot, domain.state.documentResignedKR);
    this.kyb_validation = createSnapshotFromDomain(KYBValidationKRSnapshot, domain.state.kybValidationKR);
    this.kyc_validation = createSnapshotFromDomain(KYCValidationKRSnapshot, domain.state.kycValidationKR);
    this.marsbase_commission = createSnapshotFromDomain(MarsbaseCommissionKRSnapshot, domain.state.marsbaseCommissionKR);
    this.offer_maker_validation = createSnapshotFromDomain(OfferMakerValidationKRSnapshot, domain.state.offerMakerValidationKR);
    this.telegram_chat = createSnapshotFromDomain(TelegramChatKRSnapshot, domain.state.telegramChatKR);
    this.transaction_payment = createSnapshotFromDomain(TransactionPaymentKRSnapshot, domain.state.transactionPaymentKR);
  }
  toDomain(): DealKeyResults {
    return DealKeyResults.fromSnapshot(
      this.agent_commission.toDomain(),
      this.agent_validation.toDomain(),
      this.aml_validation.toDomain(),
      this.bid_maker_validation.toDomain(),
      this.document_ownership.toDomain(),
      this.document_resigned.toDomain(),
      this.kyb_validation.toDomain(),
      this.kyc_validation.toDomain(),
      this.marsbase_commission.toDomain(),
      this.offer_maker_validation.toDomain(),
      this.telegram_chat.toDomain(),
      this.transaction_payment.toDomain(),
    );
  }
}
