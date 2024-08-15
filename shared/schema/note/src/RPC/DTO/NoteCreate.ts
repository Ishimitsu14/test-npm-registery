import { NotePK } from '../../Resource';

export namespace NoteCreate {
  export type Payload = {
    ownerId: string;
    namespace: string;
    entityPk: string;
    entity: string;
    text: string;
  };

  export type Result = NotePK;
}
