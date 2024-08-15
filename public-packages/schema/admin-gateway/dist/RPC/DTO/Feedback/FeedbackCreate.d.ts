import { FeedbackPK } from '../../../Resource';
export type FeedbackCreatePayload = {
    text: string;
    page: string;
    rating: number;
    userPk: string;
};
export type FeedbackCreateResult = FeedbackPK;
