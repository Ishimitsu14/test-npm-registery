import { RpcNextFunction } from '../external.types';

export const emptyNextFunction: RpcNextFunction = () => Promise.resolve(null);
