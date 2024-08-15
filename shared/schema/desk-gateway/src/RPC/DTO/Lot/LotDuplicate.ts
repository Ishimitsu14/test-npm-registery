import { Lot, LotKey } from '../../../Resource';

export type LotDuplicatePayload = {
  id: LotKey['id'];
};

export type LotDuplicateResult = Lot;
