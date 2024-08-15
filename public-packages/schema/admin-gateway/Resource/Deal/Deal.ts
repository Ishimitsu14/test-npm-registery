import { CoreSchema } from '../../../core';
import { BidKey } from '../Bid';
import { UserKey } from '../User';
import { DealKey } from './DealKey';
import { DealStatus } from './Enums';
import { DealKeyResults } from './ValueObjects';

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
  offerMakers: UserKey[];
  bidMakers: UserKey[];
}
