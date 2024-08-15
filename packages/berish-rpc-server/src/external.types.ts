export type RpcNextFunction = () => Promise<any>;
export type RpcHandler = (next: RpcNextFunction) => any;
export type RpcRequestParser = (body: any) => any;
