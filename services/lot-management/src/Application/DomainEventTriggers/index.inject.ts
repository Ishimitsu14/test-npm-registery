import { ModuleMetadata } from '@nestjs/common';

import { AssetArchivedThenLotArchiveTrigger } from './AssetArchivedThenLotArchiveTrigger';
import { BidAcceptedThenCreateDealTrigger } from './BidAcceptedThenCreateDealTrigger';
import { BidArchivedThenDealRejectTrigger } from './BidArchivedThenDealRejectTrigger';
import { BidReceivedThenSendNotificationTrigger } from './BidReceivedThenSendNotificationTrigger';
import { BidStatusChangedThenSendNotificationTrigger } from './BidStatusChangedThenSendNotificationTrigger';
import { DealCompletedThenLotTransactionExecuteTrigger } from './DealCompletedThenLotTransactionExecuteTrigger';
import { DealCreatedThenLotTransactionCreateTrigger } from './DealCreatedThenLotTransactionCreateTrigger';
import { DealRejectedThenLotTransactionFailTrigger } from './DealRejectedThenLotTransactionFailTrigger';
import { DealStatusChangedThenSendNotificationTrigger } from './DealStatusChangedThenSendNotificationTrigger';
import { LotArchivedThenBidArchiveTrigger } from './LotArchivedThenBidArchiveTrigger';
import { LotCreatedThenSendNotificationTrigger } from './LotCreatedThenSendNotificationTrigger';
import { LotQuestionApprovedThenSendNotificationTrigger } from './LotQuestionApprovedThenSendNotificationTrigger';
import { LotStatusChangedThenSendNotificationTrigger } from './LotStatusChangedThenSendNotificationTrigger';

export const DOMAIN_EVENT_TRIGGERS: ModuleMetadata['providers'] = [
  BidAcceptedThenCreateDealTrigger,
  DealCreatedThenLotTransactionCreateTrigger,
  DealCompletedThenLotTransactionExecuteTrigger,
  DealRejectedThenLotTransactionFailTrigger,
  LotCreatedThenSendNotificationTrigger,
  DealStatusChangedThenSendNotificationTrigger,
  LotStatusChangedThenSendNotificationTrigger,
  BidReceivedThenSendNotificationTrigger,
  BidStatusChangedThenSendNotificationTrigger,
  AssetArchivedThenLotArchiveTrigger,
  LotArchivedThenBidArchiveTrigger,
  BidArchivedThenDealRejectTrigger,
  LotQuestionApprovedThenSendNotificationTrigger,
];
