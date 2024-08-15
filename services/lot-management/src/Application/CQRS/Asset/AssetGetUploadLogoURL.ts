import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { LotManagementSchema } from '@schema/lot-management';
import { validateRoot } from '@shared/validation';

import { FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../../InjectTokens';

export type AssetGetUploadLogoURLProps = LotManagementSchema.RPC.DTO.AssetGetUploadLogoURL.Payload;
export type AssetGetUploadLogoURLResult = LotManagementSchema.RPC.DTO.AssetGetUploadLogoURL.Result;

export class AssetGetUploadLogoURL implements UseCase<AssetGetUploadLogoURLProps, AssetGetUploadLogoURLResult> {
  @Inject(FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private fileManagementRPC: FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  async validate(payload: AssetGetUploadLogoURLProps) {
    validateRoot(payload, {});
  }

  async execute(payload: AssetGetUploadLogoURLProps): Promise<AssetGetUploadLogoURLResult> {
    const fileUploader = await this.fileManagementRPC.send('file.getUploadURL', { prefix: 'asset-logo' });

    return fileUploader;
  }
}
