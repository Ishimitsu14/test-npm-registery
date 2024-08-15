export interface PubsubMessageTopic {
  topic: string;
}

export interface PubsubMessageKey extends PubsubMessageTopic {
  id: string;
}

export interface PubsubMessage<Content extends Record<string, any> = Record<string, any>, Metadata extends Record<string, any> = Record<string, any>> {
  key: PubsubMessageKey;
  content: Content;
  metadata: Metadata;
}

export interface PubsubMessageNamespaceInput<
  Content extends Record<string, any> = Record<string, any>,
  Metadata extends Record<string, any> = Record<string, any>,
  MessageInputOptions extends Record<string, any> = Record<string, any>,
> {
  namespace: string;
  key: PubsubMessageKey;
  content: Content;
  metadata: Metadata;
  messageOptions: MessageInputOptions;
}

export interface PubsubMessageInput<
  Content extends Record<string, any> = Record<string, any>,
  Metadata extends Record<string, any> = Record<string, any>,
  MessageInputOptions extends Record<string, any> = Record<string, any>,
> {
  key: PubsubMessageKey;
  content: Content;
  metadata: Metadata;
  messageOptions: MessageInputOptions;
}

export type PubsubMessageInferContent<T> = T extends PubsubMessage<infer Content, any> | PubsubMessageInput<infer Content, any, any> ? Content : never;

export type PubsubMessageInferMetadata<T> = T extends PubsubMessage<any, infer Metadata> | PubsubMessageInput<any, infer Metadata, any> ? Metadata : never;
