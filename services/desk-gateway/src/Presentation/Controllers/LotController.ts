import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { LotService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class LotController {
  @Inject(LotService)
  private readonly lotService: LotService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.archive'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async archive() {
    const { params } = useRpcRequestInfo();
    return this.lotService.archive(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.cancelModeration'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async cancelModeration() {
    const { params } = useRpcRequestInfo();
    return this.lotService.cancelModeration(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.complete'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async complete() {
    const { params } = useRpcRequestInfo();
    return this.lotService.complete(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.create'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async create() {
    const { params } = useRpcRequestInfo();
    return this.lotService.create(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.duplicate'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async duplicate() {
    const { params } = useRpcRequestInfo();
    return this.lotService.duplicate(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    return this.lotService.getById(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.lotService.list(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.sendOnModeration'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async sendOnModeration() {
    const { params } = useRpcRequestInfo();
    return this.lotService.sendOnModeration(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.update'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async update() {
    const { params } = useRpcRequestInfo();
    return this.lotService.update(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.getUploadPitchDeckURL'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async getUploadPitchDeckURL() {
    const { params } = useRpcRequestInfo();
    return this.lotService.getUploadPitchDeckURL(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lot.getUploadTokenomicsURL'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async getUploadTokenomicsURL() {
    const { params } = useRpcRequestInfo();
    return this.lotService.getUploadTokenomicsURL(params);
  }
}
