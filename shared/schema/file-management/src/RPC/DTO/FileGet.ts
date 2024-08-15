import { File } from '../../Resource';

export namespace FileGet {
  export type Payload = {
    id: string;
    asAttachment?: boolean;
  };

  export type Result = File;
}
