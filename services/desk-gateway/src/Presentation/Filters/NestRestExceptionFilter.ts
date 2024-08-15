import { RuntimeError } from '@ddd/errors';
import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { RpcError } from '@packages/berish-rpc-client';
import { Response } from 'express';

@Catch()
export class NestRestExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const httpException = this.getHttpException(exception);
    const status = httpException.getStatus();
    const body = httpException.getResponse();

    response.status(status).json(body);
  }

  private getHttpException(exception: any): HttpException {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      if (status === HttpStatus.NOT_FOUND) return new ForbiddenException(RpcError.MethodNotFound());

      return new ForbiddenException(RpcError.Custom(exception.name, exception.message));
    }
    if (exception instanceof RpcError) return new ForbiddenException(exception.toJSON());
    if (RuntimeError.isExtends(exception)) return this.getHttpException(RpcError.Custom(exception.name, exception.message, exception.params));

    return this.getHttpException(RpcError.InternalError());
  }
}
