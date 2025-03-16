import { ErrAsync } from "./err";
import { OkAsync } from "./ok";

export type ResultAsync<T, E> = OkAsync<T, E> | ErrAsync<T, E>;

export { ErrAsync, OkAsync };
