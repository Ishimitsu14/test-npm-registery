import * as DTO from './DTO';

export type Schema = {
  note: {
    create(payload: DTO.NoteCreate.Payload): DTO.NoteCreate.Result;
    update(payload: DTO.NoteUpdate.Payload): DTO.NoteUpdate.Result;
    getById(payload: DTO.NoteGetById.Payload): DTO.NoteGetById.Result;
    list(payload: DTO.NoteList.Payload): DTO.NoteList.Result;
    remove(payload: DTO.NoteRemove.Payload): DTO.NoteRemove.Result;
  };
};
