export type NODE_ENV = 'production' | 'development' | 'test';
export const NODE_ENV = <NODE_ENV>process.env.NODE_ENV || 'development';
