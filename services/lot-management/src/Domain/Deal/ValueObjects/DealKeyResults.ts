import { StateObject, StateObjectUpdateCallback } from '@ddd/domain';

import { Percent } from '../../Common';
import {
  AgentCommissionKR,
  AgentValidationKR,
  AMLValidationKR,
  BidMakerValidationKR,
  DocumentOwnershipKR,
  DocumentResignedKR,
  KYBValidationKR,
  KYCValidationKR,
  MarsbaseCommissionKR,
  OfferMakerValidationKR,
  TelegramChatKR,
  TransactionPaymentKR,
} from '../KeyResults';

export type DealKeyResultsState = {
  agentCommissionKR: AgentCommissionKR;
  agentValidationKR: AgentValidationKR;
  amlValidationKR: AMLValidationKR;
  bidMakerValidationKR: BidMakerValidationKR;
  documentOwnershipKR: DocumentOwnershipKR;
  documentResignedKR: DocumentResignedKR;
  kybValidationKR: KYBValidationKR;
  kycValidationKR: KYCValidationKR;
  marsbaseCommissionKR: MarsbaseCommissionKR;
  offerMakerValidationKR: OfferMakerValidationKR;
  telegramChatKR: TelegramChatKR;
  transactionPaymentKR: TransactionPaymentKR;
};

export class DealKeyResults extends StateObject<DealKeyResultsState> {
  static createEmpty() {
    return new DealKeyResults({
      agentCommissionKR: AgentCommissionKR.createNew(),
      agentValidationKR: AgentValidationKR.createNew(),
      amlValidationKR: AMLValidationKR.createNew(),
      bidMakerValidationKR: BidMakerValidationKR.createNew(),
      documentOwnershipKR: DocumentOwnershipKR.createNew(),
      documentResignedKR: DocumentResignedKR.createNew(),
      kybValidationKR: KYBValidationKR.createNew(),
      kycValidationKR: KYCValidationKR.createNew(),
      marsbaseCommissionKR: MarsbaseCommissionKR.createNew(Percent.fromHumanValue(5, Percent.TWO_DECIMALS)),
      offerMakerValidationKR: OfferMakerValidationKR.createNew(),
      telegramChatKR: TelegramChatKR.createNew(),
      transactionPaymentKR: TransactionPaymentKR.createNew(),
    });
  }

  static fromSnapshot(
    agentCommissionKR: AgentCommissionKR,
    agentValidationKR: AgentValidationKR,
    amlValidationKR: AMLValidationKR,
    bidMakerValidationKR: BidMakerValidationKR,
    documentOwnershipKR: DocumentOwnershipKR,
    documentResignedKR: DocumentResignedKR,
    kybValidationKR: KYBValidationKR,
    kycValidationKR: KYCValidationKR,
    marsbaseCommissionKR: MarsbaseCommissionKR,
    offerMakerValidationKR: OfferMakerValidationKR,
    telegramChatKR: TelegramChatKR,
    transactionPaymentKR: TransactionPaymentKR,
  ) {
    return new DealKeyResults({
      agentCommissionKR,
      agentValidationKR,
      amlValidationKR,
      bidMakerValidationKR,
      documentOwnershipKR,
      documentResignedKR,
      kybValidationKR,
      kycValidationKR,
      marsbaseCommissionKR,
      offerMakerValidationKR,
      telegramChatKR,
      transactionPaymentKR,
    });
  }

  private constructor(state: DealKeyResultsState) {
    super();

    this.initState(state);
  }

  updateAgentCommissionKR(agentCommissionKR: StateObjectUpdateCallback<AgentCommissionKR>) {
    return this.set('agentCommissionKR', agentCommissionKR);
  }

  updateAgentValidationKR(agentValidationKR: StateObjectUpdateCallback<AgentValidationKR>) {
    return this.set('agentValidationKR', agentValidationKR);
  }

  updateAMLValidationKR(amlValidationKR: StateObjectUpdateCallback<AMLValidationKR>) {
    return this.set('amlValidationKR', amlValidationKR);
  }

  updateBidMakerValidationKR(bidMakerValidationKR: StateObjectUpdateCallback<BidMakerValidationKR>) {
    return this.set('bidMakerValidationKR', bidMakerValidationKR);
  }

  updateDocumentOwnershipKR(documentOwnershipKR: StateObjectUpdateCallback<DocumentOwnershipKR>) {
    return this.set('documentOwnershipKR', documentOwnershipKR);
  }

  updateDocumentResignedKR(documentResignedKR: StateObjectUpdateCallback<DocumentResignedKR>) {
    return this.set('documentResignedKR', documentResignedKR);
  }

  updateKYBValidationKR(kybValidationKR: StateObjectUpdateCallback<KYBValidationKR>) {
    return this.set('kybValidationKR', kybValidationKR);
  }

  updateKYCValidationKR(kycValidationKR: StateObjectUpdateCallback<KYCValidationKR>) {
    return this.set('kycValidationKR', kycValidationKR);
  }

  updateMarsbaseCommissionKR(marsbaseCommissionKR: StateObjectUpdateCallback<MarsbaseCommissionKR>) {
    return this.set('marsbaseCommissionKR', marsbaseCommissionKR);
  }

  updateOfferMakerValidationKR(offerMakerValidationKR: StateObjectUpdateCallback<OfferMakerValidationKR>) {
    return this.set('offerMakerValidationKR', offerMakerValidationKR);
  }

  updateTelegramChatKR(telegramChatKR: StateObjectUpdateCallback<TelegramChatKR>) {
    return this.set('telegramChatKR', telegramChatKR);
  }

  updateTransactionPaymentKR(transactionPaymentKR: StateObjectUpdateCallback<TransactionPaymentKR>) {
    return this.set('transactionPaymentKR', transactionPaymentKR);
  }
}
