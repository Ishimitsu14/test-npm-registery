import { UserRoleType } from '../../../Resource';

export type UserRoleCreatePayload = {
  userId: string;
  type: UserRoleType;
};

export type UserRoleCreateResult = void;
