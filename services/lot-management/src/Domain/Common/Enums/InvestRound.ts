import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class InvestRound extends Enumeration<LotManagementSchema.InvestRound> {
  static FUNDING_ROUND = new InvestRound('FUNDING_ROUND');
  static PRESALE = new InvestRound('PRESALE');
  static PRESEED = new InvestRound('PRESEED');
  static PRIVATE = new InvestRound('PRIVATE');
  static ROUND_A = new InvestRound('ROUND_A');
  static ROUND_B = new InvestRound('ROUND_B');
  static ROUND_C = new InvestRound('ROUND_C');
  static SEED = new InvestRound('SEED');
}
