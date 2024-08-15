import { Lot, LotKey } from '../../../Resource';

export type LotArchivePayload = {
  id: LotKey['id'];
};

export type LotArchiveResult = Lot;
