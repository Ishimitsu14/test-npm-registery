import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

export class InvestorType extends Enumeration<LotManagementSchema.InvestorType> {
  static PRIVATE_INVESTOR = new InvestorType('PRIVATE_INVESTOR');
  static VENTURE_FUND = new InvestorType('VENTURE_FUND');
  static COMMUNITY_FUND = new InvestorType('COMMUNITY_FUND');
  static PROJECT_TEAM = new InvestorType('PROJECT_TEAM');
}
