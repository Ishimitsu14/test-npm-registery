import { Deal, DealKey, DealKeyUpdates } from '../../../Resource';

export type DealUpdateKeyResultPayload = {
  id: DealKey['id'];
} & DealKeyUpdates;

export type DealUpdateKeyResultResult = Deal;
