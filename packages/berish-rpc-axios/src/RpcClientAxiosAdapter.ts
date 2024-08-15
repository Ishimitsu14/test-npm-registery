import { IRpcClientAdapter } from '@packages/berish-rpc-client';
import { AxiosInstance } from 'axios';

export function RpcClientAxiosAdapter(axiosClient: AxiosInstance): IRpcClientAdapter {
  return {
    send: async (request) => {
      const { method, ...data } = request;
      const axiosResponse = await axiosClient.request({ data, method: 'POST', url: method });
      return axiosResponse.data;
    },
  };
}
