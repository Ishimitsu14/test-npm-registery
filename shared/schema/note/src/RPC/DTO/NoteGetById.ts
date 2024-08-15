import { Note } from '../../Resource';

export namespace NoteGetById {
  export type Payload = {
    id: string;
  };

  export type Result = Note;
}
