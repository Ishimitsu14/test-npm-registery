import { UserIdentitySchema } from '@schema/user-identity';
import type nats from 'nats';

// ARTIFACTS

// Nats
export const NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN = Symbol('NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN ');
export type NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN = () => Promise<nats.NatsConnection>;

// COMPONENTS

// Message bus
export const USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN = Symbol('USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN');
export type USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN = UserIdentitySchema.RPC.Client;
