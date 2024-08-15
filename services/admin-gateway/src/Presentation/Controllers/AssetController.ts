import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { AssetService } from '../../Application';

@NestRpcController({})
export class AssetController {
  @Inject(AssetService)
  private readonly assetService: AssetService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('asset.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    return this.assetService.create(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('asset.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    return this.assetService.getById(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('asset.getUploadAnalyticURL'))
  async getUploadAnalyticURL() {
    const { params } = useRpcRequestInfo();
    return this.assetService.getUploadAnalyticURL(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('asset.getUploadLogoURL'))
  async getUploadLogoURL() {
    const { params } = useRpcRequestInfo();
    return this.assetService.getUploadLogoURL(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('asset.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.assetService.list(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('asset.update'))
  async update() {
    const { params } = useRpcRequestInfo();
    return this.assetService.update(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('asset.resolve'))
  async resolve() {
    const { params } = useRpcRequestInfo();
    return this.assetService.resolve(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('asset.makeActive'))
  async makeActive() {
    const { params } = useRpcRequestInfo();
    return this.assetService.makeActive(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('asset.archive'))
  async archive() {
    const { params } = useRpcRequestInfo();
    return this.assetService.archive(params);
  }
}
