import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class KeyResultType extends Enumeration<LotManagementSchema.KeyResultType> {
  static TELEGRAM_CHAT = new KeyResultType('TELEGRAM_CHAT');
  static OFFER_MAKER_VALIDATION = new KeyResultType('OFFER_MAKER_VALIDATION');
  static BID_MAKER_VALIDATION = new KeyResultType('BID_MAKER_VALIDATION');
  static AGENT_VALIDATION = new KeyResultType('AGENT_VALIDATION');
  static KYC_VALIDATION = new KeyResultType('KYC_VALIDATION');
  static AML_VALIDATION = new KeyResultType('AML_VALIDATION');
  static KYB_VALIDATION = new KeyResultType('KYB_VALIDATION');
  static DOCUMENT_OWNERSHIP = new KeyResultType('DOCUMENT_OWNERSHIP');
  static DOCUMENT_RESIGNED = new KeyResultType('DOCUMENT_RESIGNED');
  static TRANSACTION_PAYMENT = new KeyResultType('TRANSACTION_PAYMENT');
  static MARSBASE_COMMISSION = new KeyResultType('MARSBASE_COMMISSION');
  static AGENT_COMMISSION = new KeyResultType('AGENT_COMMISSION');
}
