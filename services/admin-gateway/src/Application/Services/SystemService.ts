import { AdminGatewayConfig } from '@shared/config';

export class SystemService {
  async getVersion() {
    return AdminGatewayConfig.version;
  }
}
