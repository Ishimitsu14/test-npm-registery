import { Context } from '@packages/berish-context';

import { RpcRequestInfo } from './RpcRequestInfo';
import { RpcResponseInfo } from './RpcResponseInfo';

export const RpcRequestInfoContext = new Context<RpcRequestInfo>();
export const RpcResponseInfoContext = new Context<RpcResponseInfo>();
