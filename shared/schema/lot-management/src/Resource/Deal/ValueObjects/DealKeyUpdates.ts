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
export type DealKeyResultUpdateBase<Payload extends Record<string, any>> = { status?: KeyResultStatus } & Payload;

export interface DealKeyUpdates {
  agentCommissionKR?: DealKeyResultUpdateBase<AgentCommissionKR.Update>;
  agentValidationKR?: DealKeyResultUpdateBase<AgentValidationKR.Update>;
  amlValidationKR?: DealKeyResultUpdateBase<AMLValidationKR.Update>;
  bidMakerValidationKR?: DealKeyResultUpdateBase<BidMakerValidationKR.Update>;
  documentOwnershipKR?: DealKeyResultUpdateBase<DocumentOwnershipKR.Update>;
  documentResignedKR?: DealKeyResultUpdateBase<DocumentResignedKR.Update>;
  kycValidationKR?: DealKeyResultUpdateBase<KYCValidationKR.Update>;
  kybValidationKR?: DealKeyResultUpdateBase<KYBValidationKR.Update>;
  marsbaseCommissionKR?: DealKeyResultUpdateBase<MarsbaseCommissionKR.Update>;
  offerMakerValidationKR?: DealKeyResultUpdateBase<OfferMakerValidationKR.Update>;
  telegramChatKR?: DealKeyResultUpdateBase<TelegramChatKR.Update>;
  transactionPaymentKR?: DealKeyResultUpdateBase<TransactionPaymentKR.Update>;
}
