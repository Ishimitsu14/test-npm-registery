import { KeyResultStatus, KeyResultType } from '../Enums';
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

export type DealKeyResultBase<Type extends KeyResultType, Payload extends Record<string, any>> = { type: Type; status: KeyResultStatus } & Payload;

export interface DealKeyResults {
  agentCommissionKR: DealKeyResultBase<'AGENT_COMMISSION', AgentCommissionKR.Payload>;
  agentValidationKR: DealKeyResultBase<'AGENT_VALIDATION', AgentValidationKR.Payload>;
  amlValidationKR: DealKeyResultBase<'AML_VALIDATION', AMLValidationKR.Payload>;
  bidMakerValidationKR: DealKeyResultBase<'BID_MAKER_VALIDATION', BidMakerValidationKR.Payload>;
  documentOwnershipKR: DealKeyResultBase<'DOCUMENT_OWNERSHIP', DocumentOwnershipKR.Payload>;
  documentResignedKR: DealKeyResultBase<'DOCUMENT_RESIGNED', DocumentResignedKR.Payload>;
  kybValidationKR: DealKeyResultBase<'KYB_VALIDATION', KYBValidationKR.Payload>;
  kycValidationKR: DealKeyResultBase<'KYC_VALIDATION', KYCValidationKR.Payload>;
  marsbaseCommissionKR: DealKeyResultBase<'MARSBASE_COMMISSION', MarsbaseCommissionKR.Payload>;
  offerMakerValidationKR: DealKeyResultBase<'OFFER_MAKER_VALIDATION', OfferMakerValidationKR.Payload>;
  telegramChatKR: DealKeyResultBase<'TELEGRAM_CHAT', TelegramChatKR.Payload>;
  transactionPaymentKR: DealKeyResultBase<'TRANSACTION_PAYMENT', TransactionPaymentKR.Payload>;
}
