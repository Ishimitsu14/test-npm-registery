import { ModuleMetadata } from '@nestjs/common';

import { AccountResourceMapper } from './AccountResourceMapper';
import { AssetFaqResourceMapper } from './AssetFaqResourceMapper';
import { AssetResourceMapper } from './AssetResourceMapper';
import { AuthResourceMapper } from './AuthResourceMapper';
import { BidResourceMapper } from './BidResourceMapper';
import { CoreResourceMapper } from './CoreResourceMapper';
import { DealResourceMapper } from './DealResourceMapper';
import { FavoriteLotResourceMapper } from './FavoriteLotResourceMapper';
import { FileManagementResourceMapper } from './FileManagementResourceMapper';
import { LotQuestionResourceMapper } from './LotQuestionResourceMapper';
import { LotResourceMapper } from './LotResourceMapper';
import { NotificationConfigResourceMapper } from './NotificationConfigResourceMapper';
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
  NotificationConfigResourceMapper,
  NotificationResourceMapper,
  UserResourceMapper,
  FavoriteLotResourceMapper,
  LotQuestionResourceMapper,
  AssetFaqResourceMapper,
];
