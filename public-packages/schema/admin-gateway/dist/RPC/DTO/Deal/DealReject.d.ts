import { Deal, DealKey } from '../../../Resource';
export type DealRejectPayload = {
    id: DealKey['id'];
};
export type DealRejectResult = Deal;
