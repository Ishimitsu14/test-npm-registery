import { User, UserKey } from '../../../Resource';

export type UserGetByIdPayload = {
    id: UserKey['id'];
  };
export type UserGetByIdResult = User;
