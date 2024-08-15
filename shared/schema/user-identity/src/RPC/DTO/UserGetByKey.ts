import { User, UserKey } from '../../Resource';

export namespace UserGetByKey {
  export type Payload = {
    id?: UserKey['id'];
    nickname?: string;
  };
  export type Result = User;
}
