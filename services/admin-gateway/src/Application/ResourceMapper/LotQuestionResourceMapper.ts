import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';

import { LotResourceMapper } from './LotResourceMapper';
import { UserResourceMapper } from './UserResourceMapper';

export class LotQuestionResourceMapper {
  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  toLotQuestionKey(item: LotManagementSchema.LotQuestionKey): Required<DeskGatewaySchema.LotQuestionKey> {
    return {
      resource: 'lot_question_key',
      id: item.id,
    };
  }

  toLotQuestion(item: LotManagementSchema.LotQuestion): Required<DeskGatewaySchema.LotQuestion> {
    return {
      resource: 'lot_question',
      id: item.id,
      userKey: this.userResourceMapper.toUserKey(item.userKey),
      lotKey: this.lotResourceMapper.toLotKey(item.lotKey),
      parentLotQuestion: item.parentLotQuestion ? this.toLotQuestionKey(item.parentLotQuestion) : undefined,
      text: item.text,
      status: item.status,
      createdAt: item.createdAt,
    };
  }
}
