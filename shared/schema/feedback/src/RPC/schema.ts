import * as DTO from './DTO';

export type Schema = {
  feedback: {
    getById(payload: DTO.FeedbackGetById.Payload): DTO.FeedbackGetById.Result;
    create(payload: DTO.FeedbackCreate.Payload): DTO.FeedbackCreate.Result;
    list(payload: DTO.FeedbackList.Payload): DTO.FeedbackList.Result;
    remove(payload: DTO.FeedbackRemove.Payload): DTO.FeedbackRemove.Result;
  };
};
