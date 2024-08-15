import { Note } from '../../../Resource';
export type NoteListPayload = {
    entity: string;
    entityPk: string;
};
export type NoteListResult = Note[];
