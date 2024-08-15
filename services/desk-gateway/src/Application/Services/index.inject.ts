import { ModuleMetadata } from '@nestjs/common';

import { AccountService } from './AccountService';
import { AssetFaqService } from './AssetFaqService';
import { AssetService } from './AssetService';
import { AuthService } from './AuthService';
import { BidService } from './BidService';
import { DealService } from './DealService';
import { FavoriteLotService } from './FavoriteLotService';
import { FeedbackService } from './FeedbackService';
import { FileService } from './FileService';
import { LotQuestionService } from './LotQuestionService';
import { LotService } from './LotService';
import { NotificationConfigService } from './NotificationConfigService';
import { NotificationService } from './NotificationService';
import { SumsubService } from './SumsubService';
import { SumsubWebhooksService } from './SumsubWebhooksService';
import { SystemService } from './SystemService';
import { UserService } from './UserService';
import { ViewLotService } from './ViewLotService';

export const SERVICES_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  AccountService,
  AssetService,
  AuthService,
  DealService,
  BidService,
  LotService,
  SystemService,
  UserService,
  NotificationConfigService,
  NotificationService,
  FavoriteLotService,
  FileService,
  FeedbackService,
  SumsubService,
  SumsubWebhooksService,
  LotQuestionService,
  AssetFaqService,
  ViewLotService,
];
