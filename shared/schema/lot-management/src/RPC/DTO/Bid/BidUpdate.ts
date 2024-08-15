import { CommonSchema } from '@schema/common';

import { InvestorType } from '../../../Resource';

export namespace BidUpdate {
  export type Payload = {
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
  export type Result = void;
}
