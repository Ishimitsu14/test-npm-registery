import { DeskGatewayConfig } from '@shared/config';

export class SystemService {
  async getVersion() {
    return DeskGatewayConfig.version;
  }
}
