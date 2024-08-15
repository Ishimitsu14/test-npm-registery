import { NotePK } from '../../../Resource';
export type NoteCreatePayload = {
    entity: string;
    entityPk: string;
    text: string;
};
export type NoteCreateResult = NotePK;
