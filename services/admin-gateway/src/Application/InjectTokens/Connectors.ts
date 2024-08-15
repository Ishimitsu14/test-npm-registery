import { FeedbackSchema } from '@schema/feedback';
import { FileManagementSchema } from '@schema/file-management';
import { LotManagementSchema } from '@schema/lot-management';
import { NoteSchema } from '@schema/note';
import { NotificationSchema } from '@schema/notification';
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

export const LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN = Symbol('LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN');
export type LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN = LotManagementSchema.RPC.Client;

export const FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN = Symbol('FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN');
export type FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN = FileManagementSchema.RPC.Client;

export const NOTE_RPC_COMPONENT_INJECT_TOKEN = Symbol('NOTE');
export type NOTE_RPC_COMPONENT_INJECT_TOKEN = NoteSchema.RPC.Client;

export const NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN = Symbol('NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN');
export type NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN = NotificationSchema.RPC.Client;

export const FEEDBACK_RPC_COMPONENT_INJECT_TOKEN = Symbol('FEEDBACK_RPC_COMPONENT_INJECT_TOKEN');
export type FEEDBACK_RPC_COMPONENT_INJECT_TOKEN = FeedbackSchema.RPC.Client;
