import { RuntimeError } from '@ddd/errors';
import { RpcError } from '@packages/berish-rpc-client';
import { RpcApiMethod, RpcApiMethodName, RpcApiPayload, RpcApiResult } from '@packages/berish-rpc-client-schema';
import { RpcSchemaClientCommon } from '@schema/core';
import axios, { AxiosError } from 'axios';
import fs from 'fs';

import { File, FileUploader } from '../Resource';
import * as _DTO from './DTO';
import { Schema as _Schema } from './schema';

export namespace RPC {
  export import DTO = _DTO;

  export type Schema = _Schema;

  export type MethodName = RpcApiMethodName<Schema>;
  export type Method<TPath extends MethodName> = RpcApiMethod<Schema, TPath>;
  export type Payload<TPath extends MethodName> = RpcApiPayload<Schema, TPath>;
  export type Result<TPath extends MethodName> = RpcApiResult<Schema, TPath>;

  export function MethodName<TPath extends MethodName>(path: TPath): TPath {
    return path;
  }

  export interface ClientMeta {}
  export interface ServerMeta {}

  export class Client extends RpcSchemaClientCommon<Schema, ClientMeta, ServerMeta> {
    async downloadFile(url: string): Promise<Buffer | Blob> {
      return this._catchRestError(async () => {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
      });
    }

    async uploadFile(file: fs.ReadStream | Buffer | Blob): Promise<File> {
      return this._catchRestError(async () => {
        const uploader = await this.send('file.getUploadURL', {});
        await axios.postForm(uploader.uploadURL, {
          file,
        });
        return this.send('file.get', { id: uploader.id });
      });
    }

    async uploadFileDirect(fileUploader: FileUploader, file: fs.ReadStream | File | Buffer | Blob): Promise<File> {
      return this._catchRestError(async () => {
        await axios.postForm(fileUploader.uploadURL, {
          file,
        });
        return this.send('file.get', { id: fileUploader.id });
      });
    }

    private async _catchRestError<T>(callback: () => Promise<T>): Promise<T> {
      try {
        return await callback();
      } catch (err) {
        if (err instanceof AxiosError && err.response?.data) {
          const rpcError = RpcError.fromJSON(err.response.data);

          const runtimeError = RuntimeError.resolveError(rpcError.name, rpcError.data);

          throw runtimeError || err;
        }

        throw RpcError.InvalidRequest();
      }
    }
  }
}
