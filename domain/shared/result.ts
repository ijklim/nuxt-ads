export type Result<T, E> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  readonly isOk = true;
  readonly isErr = false;
  constructor(readonly value: T) {}
}

export class Err<T, E> {
  readonly isOk = false;
  readonly isErr = true;
  constructor(readonly error: E) {}
}

export const Result = {
  ok: <T, E>(value: T): Result<T, E> => new Ok(value),
  err: <T, E>(error: E): Result<T, E> => new Err(error),
};
