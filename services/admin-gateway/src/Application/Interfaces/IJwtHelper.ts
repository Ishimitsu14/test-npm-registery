export interface IJwtHelper {
  sign(userId: string): string;
  verify(token: string): string | false;
}
