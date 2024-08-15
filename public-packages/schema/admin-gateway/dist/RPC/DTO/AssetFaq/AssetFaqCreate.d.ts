import { AssetFaq } from '../../../Resource';
export type AssetFaqCreatePayload = {
    asset: string;
    question: string;
    answer: string;
};
export type AssetFaqCreateResult = AssetFaq;
