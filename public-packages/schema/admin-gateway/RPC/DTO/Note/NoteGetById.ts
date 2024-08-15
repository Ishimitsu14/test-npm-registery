import { Note } from '../../../Resource';

export type NoteGetByIdPayload = {
  id: string;
};

export type NoteGetByIdResult = Note;
