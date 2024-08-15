import { IAuthTelegramCodeRepository, IUserRepository, IUserRoleRepository } from '../../Domain';

export const USER_REPOSITORY_INJECT_TOKEN = Symbol('USER_REPOSITORY_INJECT_TOKEN');
export type USER_REPOSITORY_INJECT_TOKEN = IUserRepository;

export const AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN = Symbol('AUTH_TELEGRAM_CODE_REPOSITORY_TOKEN');
export type AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN = IAuthTelegramCodeRepository;

export const USER_ROLE_REPOSITORY_INJECT_TOKEN = Symbol('USER_ROLE_REPOSITORY_INJECT_TOKEN');
export type USER_ROLE_REPOSITORY_INJECT_TOKEN = IUserRoleRepository;
