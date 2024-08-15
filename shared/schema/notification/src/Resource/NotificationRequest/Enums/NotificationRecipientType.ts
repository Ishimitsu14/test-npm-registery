export const NotificationRecipientType = ['PUBLIC', 'OWNER_ID'] as const;
export type NotificationRecipientType = (typeof NotificationRecipientType)[number];
