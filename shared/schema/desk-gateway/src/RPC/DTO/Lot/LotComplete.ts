import { Lot, LotKey } from '../../../Resource';

export type LotCompletePayload = {
  id: LotKey['id'];
};

export type LotCompleteResult = Lot;
