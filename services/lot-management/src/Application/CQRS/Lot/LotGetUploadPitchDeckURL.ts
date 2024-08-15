import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { LotManagementSchema } from '@schema/lot-management';
import { validateRoot } from '@shared/validation';

import { FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../../InjectTokens';

export type LotGetUploadPitchDeckURLProps = LotManagementSchema.RPC.DTO.LotGetUploadPitchDeckURL.Payload;
export type LotGetUploadPitchDeckURLResult = LotManagementSchema.RPC.DTO.LotGetUploadPitchDeckURL.Result;

export class LotGetUploadPitchDeckURL implements UseCase<LotGetUploadPitchDeckURLProps, LotGetUploadPitchDeckURLResult> {
  @Inject(FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN)
  private fileManagementRPC: FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN;

  async validate(payload: LotGetUploadPitchDeckURLProps) {
    validateRoot(payload, {});
  }

  async execute(payload: LotGetUploadPitchDeckURLProps): Promise<LotGetUploadPitchDeckURLResult> {
    const fileUploader = await this.fileManagementRPC.send('file.getUploadURL', { prefix: 'lot-pitch-deck' });

    return fileUploader;
  }
}
