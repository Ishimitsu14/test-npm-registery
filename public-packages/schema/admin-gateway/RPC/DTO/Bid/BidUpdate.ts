import { CommonSchema } from '@schema/common';

import { Bid, InvestorType } from '../../../Resource';

export type BidUpdatePayload = {
  lot: number;
  id: number;
  bidMaker: string;
  bidMakerType: InvestorType;
  location: CommonSchema.Country;
  readyForVerification: boolean;
  telegram: string;
  isDirect: boolean;
  deadline?: number;

  summary: string;
  units: string;
  price: string;
  fdv?: string;
};
export type BidUpdateResult = Bid;
