import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { LotManagementSchema } from '@schema/lot-management';
import { validateRoot } from '@shared/validation';

import { FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../../InjectTokens';

export type AssetGetUploadAnalyticURLProps = LotManagementSchema.RPC.DTO.AssetGetUploadLogoURL.Payload;
export type AssetGetUploadAnalyticURLResult = LotManagementSchema.RPC.DTO.AssetGetUploadLogoURL.Result;

export class AssetGetUploadAnalyticURL implements UseCase<AssetGetUploadAnalyticURLProps, AssetGetUploadAnalyticURLResult> {
  @Inject(FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private fileManagementRPC: FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  async validate(payload: AssetGetUploadAnalyticURLProps) {
    validateRoot(payload, {});
  }

  async execute(payload: AssetGetUploadAnalyticURLProps): Promise<AssetGetUploadAnalyticURLResult> {
    const fileUploader = await this.fileManagementRPC.send('file.getUploadURL', { prefix: 'asset-analytic' });

    return fileUploader;
  }
}
