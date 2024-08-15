import { Lot, LotKey } from '../../../Resource';

export type LotCancelModerationPayload = {
  id: LotKey['id'];
};

export type LotCancelModerationResult = Lot;
