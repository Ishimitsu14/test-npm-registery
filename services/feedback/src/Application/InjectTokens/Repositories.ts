import { IFeedbackRepository } from '../../Domain';

export const FEEDBACK_REPOSITORY_INJECT_TOKEN = Symbol('FEEDBACK_REPOSITORY_INJECT_TOKEN');
export type FEEDBACK_REPOSITORY_INJECT_TOKEN = IFeedbackRepository;
