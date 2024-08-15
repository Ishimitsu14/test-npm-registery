import { IEvmAuthHelper, IHashStringHelper, ISumsubAuthHelper } from '../../Domain';

export const EVM_AUTH_HELPER_INJECT_TOKEN = Symbol('EVM_AUTH_HELPER_INJECT_TOKEN');
export type EVM_AUTH_HELPER_INJECT_TOKEN = IEvmAuthHelper;

export const HASH_STRING_HELPER_INJECT_TOKEN = Symbol('HASH_STRING_HELPER_INJECT_TOKEN');
export type HASH_STRING_HELPER_INJECT_TOKEN = IHashStringHelper;

export const SUMSUB_AUTH_HELPER_INJECT_TOKEN = Symbol('SUMSUB_AUTH_HELPER_INJECT_TOKEN');
export type SUMSUB_AUTH_HELPER_INJECT_TOKEN = ISumsubAuthHelper;
