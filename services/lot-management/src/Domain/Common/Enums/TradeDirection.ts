import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class TradeDirection extends Enumeration<LotManagementSchema.TradeDirection> {
  static BUY = new TradeDirection('BUY');
  static SELL = new TradeDirection('SELL');
}
