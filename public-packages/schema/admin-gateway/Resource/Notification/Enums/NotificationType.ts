export const NotificationType = [
  'SYSTEM_INFO',
  'DEAL_CREATED',
  'DEAL_STATUS_CHANGED',
  'LOT_CREATED',
  'LOT_STATUS_CHANGED',
  'BID_RECEIVED',
  'BID_STATUS_CHANGED',
  'USER_REGISTERED',
  'USER_PROFILE_CHANGED',
  'LOT_QUESTION_RECEIVED',
  'LOT_QUESTION_PUBLISHED',
] as const;

export type NotificationType = (typeof NotificationType)[number];
