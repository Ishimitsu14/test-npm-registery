import { EnumSnapshot } from '@shared/db';

import { NotificationRecipientType } from '../../../../../../Domain';

export type NotificationRecipientTypeSnapshot = EnumSnapshot<NotificationRecipientType>;
export const NotificationRecipientTypeSnapshot = EnumSnapshot(NotificationRecipientType);
