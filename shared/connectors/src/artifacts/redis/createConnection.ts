import Redis from 'ioredis';

export interface CreateConnectionOptions {
  host: string;
  port: number;
  db: number;
  username: string;
  password: string;
  useTLS: boolean;
}

export function createConnection({ host, port, db, username, password, useTLS }: CreateConnectionOptions) {
  return new Redis({
    host,
    port,
    db,
    username,
    password,
    tls: useTLS ? {} : undefined,

    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  });
}
