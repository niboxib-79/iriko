import type { ErrAsync } from "./err";
import type { OkAsync } from "./ok";

export type ResultAsync<T, E> = OkAsync<T, E> | ErrAsync<T, E>;
