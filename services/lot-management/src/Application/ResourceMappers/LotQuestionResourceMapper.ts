import { NullableObject } from '@ddd/core';
import { LotManagementSchema } from '@schema/lot-management';

import { LotPK, LotQuestion, LotQuestionPK, UserPK } from '../../Domain';

export class LotQuestionResourceMapper {
  toLotQuestion(lotQuestion: LotQuestion): LotManagementSchema.LotQuestion {
    return {
      resource: 'lot_question',
      id: lotQuestion.primaryKey.id,
      userKey: this.toUserKey(lotQuestion.userPK),
      lotKey: this.toLotKey(lotQuestion.lotPK),
      text: lotQuestion.text,
      parentLotQuestion: NullableObject.isEmpty(lotQuestion.parentLotQuestionPK) ? undefined : this.toLotQuestionKey(lotQuestion.parentLotQuestionPK),
      status: lotQuestion.status.id,
      createdAt: +lotQuestion.createdAt,
    };
  }

  toUserKey(userPK: UserPK): LotManagementSchema.UserKey {
    return {
      resource: 'user_key',
      id: userPK.id,
    };
  }

  toLotKey(lotPK: LotPK): LotManagementSchema.LotKey {
    return {
      resource: 'lot_key',
      id: lotPK.id,
    };
  }

  toLotQuestionKey(lotQuestionPK: LotQuestionPK): LotManagementSchema.LotQuestionKey {
    return {
      resource: 'lot_question_key',
      id: lotQuestionPK.id,
    };
  }
}
