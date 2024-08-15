import { CommonSchema } from '@schema/common';

import { CoreSchema } from '../../../core';
import { InvestorType, MediatorType } from '../Common';
import { LotKey } from '../Lot';
import { UserKey } from '../User';
import { BidKey } from './BidKey';
import { BidRejectReasonType, BidStatus } from './Enums';

export interface Bid extends CoreSchema.Resource<'bid', BidKey> {
  createdAt: number;
  deadline?: number;
  status: BidStatus;
  bidMakerType: InvestorType;
  location: CommonSchema.Country;
  mediatorType: MediatorType;
  telegram: string;
  readyForVerification: boolean;
  rejectReason: BidRejectReasonType;

  summary: string;
  units: string;
  price: string;
  fdv?: string;

  // References
  lotKey: LotKey;
  bidMakerKey: UserKey;
}
