import { IRpcServerAdapter, RpcError, RpcLogger, RpcRequest, RpcServer } from '@packages/berish-rpc-server';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import * as http from 'http';

export interface RpcServerExpressAdapterOptions {
  name?: string; // express
  mountPath?: string; // rpc
  port?: number; // 3000
  express?: Application; // New express
  useRawBody?: boolean; // true
}

export class RpcServerExpressAdapter implements IRpcServerAdapter {
  private readonly name: string;
  private readonly useRawBody: boolean;
  private readonly express: Application;
  private readonly mountPath: string;
  private readonly port: number;

  private rpcServer: RpcServer;
  private rpcLogger: RpcLogger;
  private httpServer: http.Server;

  constructor(options?: RpcServerExpressAdapterOptions) {
    this.onRequest = this.onRequest.bind(this);

    this.name = options?.name ?? 'express';
    this.useRawBody = Boolean(options?.useRawBody ?? true);
    this.express = options?.express ?? express();
    this.mountPath = options?.mountPath ?? 'rpc';
    this.port = options?.port ?? 3000;
  }

  getAdapterName(): string {
    return this.name;
  }

  registerLogger(logger: RpcLogger): void {
    this.rpcLogger = logger;
  }

  registerServer(server: RpcServer) {
    this.rpcServer = server;

    this.express.use(
      cors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://localhost:5173'],
      }),
    );

    // this.express.use((request, response, next) => {
    //   console.log(request.headers.origin);
    //   response.header('Access-Control-Allow-Origin', request.headers.origin);
    //   response.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    //   response.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS');
    //   response.header('Access-Control-Allow-Credentials', 'true');
    //   next();
    // });
    this.express.post(`${this.mountPath}/:method?`, this.onRequest);
  }

  async start() {
    this.httpServer = await new Promise<http.Server>((resolve) => {
      const server = this.express.listen(this.port, () => resolve(server));
    });
    this.rpcLogger?.log(`Started at ${this.port} at path '${this.mountPath}'.`);
  }

  async stop(): Promise<void> {
    if (this.httpServer) {
      const self_httpServer = this.httpServer;
      this.httpServer = null;

      await new Promise<void>((resolve) => self_httpServer.close(() => resolve()));
    }
    this.rpcLogger?.log(`Closed.`);
  }

  async onRequest(request: Request, res: Response) {
    const rpcResponse = await this.rpcServer.wrapRequest(async () => {
      if (this.useRawBody) await this.rawBody(request);

      const body = this.concatData(request);
      return this.requestStringParser(body);
    });

    res.status(200);
    res.json(rpcResponse);
  }

  private concatData(req: Request) {
    return Object.assign({}, req.query, req.params, req.body);
  }

  private requestStringParser(body: any): RpcRequest {
    try {
      if (typeof body === 'string') return JSON.parse(body);
      return body;
    } catch (err) {
      throw RpcError.ParseError();
    }
  }

  private async rawBody(request: Request) {
    try {
      const bodyStringify = await new Promise<string | Record<string, any>>((resolve) => {
        let buf = '';
        request.on('data', (x) => (buf += x));
        request.on('end', () => {
          resolve(buf);
        });
      });

      const body = typeof bodyStringify === 'string' ? JSON.parse(bodyStringify) : bodyStringify;
      request.body = body;
    } catch (err) {
      throw RpcError.ParseError();
    }
  }
}
