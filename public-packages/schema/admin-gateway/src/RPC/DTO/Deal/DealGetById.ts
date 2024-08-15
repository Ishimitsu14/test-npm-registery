import { Deal, DealKey } from '../../../Resource';

export type DealGetByIdPayload = {
  id: DealKey['id'];
};

export type DealGetByIdResult = Deal;
