import { CoreSchema } from '@schema/core';

import { BidMakerKey, OfferMakerKey } from '../Actors';
import { BidKey } from '../Bid';
import { DealKey } from './DealKey';
import { DealStatus } from './Enums';
import { DealKeyResults } from './ValueObjects/DealKeyResults';

export interface Deal extends CoreSchema.Resource<'deal', DealKey> {
  createdAt: number;
  status: DealStatus;
  keyResults: DealKeyResults;
  summary: string;
  units: string;
  price: string;
  fdv?: string;

  // References
  bidKey: BidKey;
  offerMakers: OfferMakerKey[];
  bidMakers: BidMakerKey[];
}
