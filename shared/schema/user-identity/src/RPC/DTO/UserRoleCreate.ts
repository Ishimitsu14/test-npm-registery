import { UserRoleType } from '../../Resource';

export namespace UserRoleCreate {
  export type Payload = {
    userId: string;
    type: UserRoleType;
  };
  export type Result = void;
}
