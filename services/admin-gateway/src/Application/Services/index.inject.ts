import { ModuleMetadata } from '@nestjs/common';

import { AccountService } from './AccountService';
import { AssetFaqService } from './AssetFaqService';
import { AssetService } from './AssetService';
import { AuthService } from './AuthService';
import { BidService } from './BidService';
import { DealService } from './DealService';
import { FeedbackService } from './FeedbackService';
import { LotBadgeService } from './LotBadgeService';
import { LotQuestionService } from './LotQuestionService';
import { LotService } from './LotService';
import { NoteService } from './NoteService';
import { NotificationService } from './NotificationService';
import { SystemService } from './SystemService';
import { UserRoleService } from './UserRoleService';
import { UserService } from './UserService';

export const SERVICES_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  AccountService,
  AssetService,
  AuthService,
  DealService,
  BidService,
  LotService,
  SystemService,
  UserService,
  UserRoleService,
  NoteService,
  NotificationService,
  FeedbackService,
  LotQuestionService,
  AssetFaqService,
  LotBadgeService,
];
