import { Note } from '../../Resource';

export namespace NoteList {
  export type Payload = {
    namespace: string;
    entity: string;
    entityPk: string;
  };

  export type Result = Note[];
}
