import { UserIdentityConfig } from '@shared/config';
import crypto from 'crypto';
import { millisecondsToSeconds } from 'date-fns';

import { IBuildHeadersParams, IGetSignatureParams, ISumsubAuthHelper, ISumsubHeaders } from '../../Domain';

export class SumsubAuthHelper implements ISumsubAuthHelper {
  generateSignature({ url, timestamp, method, body }: IGetSignatureParams): string {
    const signature = crypto.createHmac('sha256', UserIdentityConfig.sumsub.apiSecret);

    signature.update(timestamp + method.toUpperCase() + url.replace(UserIdentityConfig.sumsub.apiUrl, ''));
    signature.update(Buffer.from(JSON.stringify(body)));

    return signature.digest('hex');
  }
  generateTimestamp(): number {
    return millisecondsToSeconds(Date.now());
  }
  buildHeaders({ signature, timestamp }: IBuildHeadersParams): ISumsubHeaders {
    return {
      'X-App-Token': UserIdentityConfig.sumsub.apiToken,
      'X-App-Access-Sig': signature,
      'X-App-Access-Ts': timestamp,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }
}
