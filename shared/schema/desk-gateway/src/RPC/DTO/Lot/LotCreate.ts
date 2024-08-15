import { Lot, LotInputObject, LotType } from '../../../Resource';

export type LotCreatePayload = {
  type: LotType;
  inputs: LotInputObject;
};

export type LotCreateResult = Lot;
