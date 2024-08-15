import { Deal, DealKey } from '../../../Resource';
export type DealCompletePayload = {
    id: DealKey['id'];
};
export type DealCompleteResult = Deal;
