import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class NestRpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    return throwError(() => new RpcException(exception));
  }
}
