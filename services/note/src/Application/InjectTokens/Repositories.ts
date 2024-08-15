import { INoteRepository } from '../../Domain';

export const NOTE_REPOSITORY_INJECT_TOKEN = Symbol('NOTE_REPOSITORY_INJECT_TOKEN');
export type NOTE_REPOSITORY_INJECT_TOKEN = INoteRepository;
