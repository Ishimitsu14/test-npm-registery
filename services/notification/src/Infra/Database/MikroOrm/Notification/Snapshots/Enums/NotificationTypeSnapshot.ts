import { EnumSnapshot } from '@shared/db';

import { NotificationType } from '../../../../../../Domain';

export type NotificationTypeSnapshot = EnumSnapshot<NotificationType>;
export const NotificationTypeSnapshot = EnumSnapshot(NotificationType);
