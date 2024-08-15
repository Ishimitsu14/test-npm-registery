import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { LotManagementSchema } from '@schema/lot-management';
import { validateRoot } from '@shared/validation';

import { FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../../InjectTokens';

export type LotGetUploadTokenomicsURLProps = LotManagementSchema.RPC.DTO.LotGetUploadTokenomicsURL.Payload;
export type LotGetUploadTokenomicsURLResult = LotManagementSchema.RPC.DTO.LotGetUploadTokenomicsURL.Result;

export class LotGetUploadTokenomicsURL implements UseCase<LotGetUploadTokenomicsURLProps, LotGetUploadTokenomicsURLResult> {
  @Inject(FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private fileManagementRPC: FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  async validate(payload: LotGetUploadTokenomicsURLProps) {
    validateRoot(payload, {});
  }

  async execute(payload: LotGetUploadTokenomicsURLProps): Promise<LotGetUploadTokenomicsURLResult> {
    const fileUploader = await this.fileManagementRPC.send('file.getUploadURL', { prefix: 'lot-tokenomics' });

    return fileUploader;
  }
}
