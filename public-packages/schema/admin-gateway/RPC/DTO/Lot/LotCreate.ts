import { Lot, LotInputObject, LotType } from '../../../Resource';

export type LotCreatePayload = {
  type: LotType;
  offerMaker: string;
  inputs: LotInputObject;
};

export type LotCreateResult = Lot;
