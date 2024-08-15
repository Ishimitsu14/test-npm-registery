import { CommonSchema } from '@schema/common';

import { BidKey, InvestorType } from '../../../Resource';

export namespace BidCreate {
  export type Payload = {
    lot: number;
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
  export type Result = BidKey;
}
