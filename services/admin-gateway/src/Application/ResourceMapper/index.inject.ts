import { ModuleMetadata } from '@nestjs/common';

import { AccountResourceMapper } from './AccountResourceMapper';
import { AssetFaqResourceMapper } from './AssetFaqResourceMapper';
import { AssetResourceMapper } from './AssetResourceMapper';
import { AuthResourceMapper } from './AuthResourceMapper';
import { BidResourceMapper } from './BidResourceMapper';
import { CoreResourceMapper } from './CoreResourceMapper';
import { DealResourceMapper } from './DealResourceMapper';
import { FeedbackResourceMapper } from './FeedbackResourceMapper';
import { FileManagementResourceMapper } from './FileManagementResourceMapper';
import { LotBadgeResourceMapper } from './LotBadgeResourceMapper';
import { LotQuestionResourceMapper } from './LotQuestionResourceMapper';
import { LotResourceMapper } from './LotResourceMapper';
import { NotificationResourceMapper } from './NotificationResourceMapper';
import { UserResourceMapper } from './UserResourceMapper';

export const RESOURCE_MAPPER_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  AccountResourceMapper,
  AssetResourceMapper,
  AuthResourceMapper,
  BidResourceMapper,
  CoreResourceMapper,
  DealResourceMapper,
  FileManagementResourceMapper,
  LotResourceMapper,
  NotificationResourceMapper,
  UserResourceMapper,
  FeedbackResourceMapper,
  LotQuestionResourceMapper,
  AssetFaqResourceMapper,
  LotBadgeResourceMapper,
];
