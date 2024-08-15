import { Nullable, NullableObject } from '@ddd/core';
import { FileManagementConfig } from '@shared/config';

import { FileEntityPK } from '../../Domain';

export interface FileURLResolverGetDownloadURLParams {
  attachment: Nullable<boolean>;
}

export class FileURLResolver {
  getDownloadURL(pk: FileEntityPK, params: FileURLResolverGetDownloadURLParams): string {
    const host = this._removeHostLastSlash(FileManagementConfig.rest.publicHost);

    const paramsPath = this._stringifyParams(params);
    const signature = 'signature';
    const paramsURL = [paramsPath, this._stringifyParams({ signature })].filter(Boolean).join('&');

    const queryURL = `${host}/file.get/${pk.id}`;
    return `${queryURL}?${paramsURL}`;
  }

  getUploadURL(pk: FileEntityPK, prefix: Nullable<string>): string {
    const host = this._removeHostLastSlash(FileManagementConfig.rest.publicHost);

    const params = {
      id: pk.id,
      prefix: NullableObject.mapUndefined(prefix),
    };

    const paramsPath = this._stringifyParams(params);
    const signature = 'signature';
    const paramsURL = [paramsPath, this._stringifyParams({ signature })].filter(Boolean).join('&');

    const queryURL = `${host}/file.upload`;
    return `${queryURL}?${paramsURL}`;
  }

  private _removeHostLastSlash(host: string): string {
    if (host.charAt(host.length - 1) === '/') return this._removeHostLastSlash(host.substring(0, host.length - 1));
    return host;
  }

  private _stringifyParams(params: Record<string, any>): string {
    const paramsURL = Object.entries(params)
      .filter(([key, value]) => [key, value].every((m) => NullableObject.hasValue(m) && Boolean(m)))
      .map(([key, value]) => `${String(key)}=${String(value)}`)
      .join('&');

    return paramsURL;
  }
}
