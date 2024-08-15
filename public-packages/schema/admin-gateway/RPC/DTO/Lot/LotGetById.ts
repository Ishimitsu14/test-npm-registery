import { Lot, LotKey } from '../../../Resource';

export type LotGetByIdPayload = {
  id: LotKey['id'];
};

export type LotGetByIdResult = Lot;
