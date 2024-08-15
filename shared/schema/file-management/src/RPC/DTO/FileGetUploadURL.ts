import { FileUploader } from '../../Resource';

export namespace FileGetUploadURL {
  export type Payload = {
    prefix?: string;
  };
  export type Result = FileUploader;
}
