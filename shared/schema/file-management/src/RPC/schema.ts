import * as DTO from './DTO';

export type Schema = {
  file: {
    get(payload: DTO.FileGet.Payload): DTO.FileGet.Result;
    getUploadURL(payload: DTO.FileGetUploadURL.Payload): DTO.FileGetUploadURL.Result;
    list(payload: DTO.FileList.Payload): DTO.FileList.Result;
  };
};
