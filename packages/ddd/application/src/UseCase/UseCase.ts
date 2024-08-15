export interface UseCase<Payload, Result> {
  validate(payload: Payload): Promise<void>;
  execute(payload: Payload): Promise<Result>;
}
