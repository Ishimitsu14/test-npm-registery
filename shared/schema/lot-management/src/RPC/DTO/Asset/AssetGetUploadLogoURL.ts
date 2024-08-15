import { FileManagementSchema } from '@schema/file-management';

export namespace AssetGetUploadLogoURL {
  export type Payload = {};
  export type Result = FileManagementSchema.FileUploader;
}
