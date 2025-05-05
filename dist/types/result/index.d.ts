import { ErrAsync, OkAsync, type ResultAsync } from "./async";
import { Err } from "./err";
import { Ok } from "./ok";
export type Result<T, E> = Ok<T, E> | Err<T, E>;
export type UnwrapR<T> = T extends Result<infer U, infer _> ? U : never;
interface ResultT {
    try: <T, E = unknown>(f: () => T) => Result<T, E>;
    try_async: <T, E = unknown>(f: () => Promise<T>) => Promise<Result<T, E>>;
    try_promise: <T, E = unknown>(p: Promise<T>) => Promise<Result<Awaited<T>, E>>;
    async: <T, E>(p: Promise<Result<T, E>>) => ResultAsync<T, E>;
    all: <T, E>(arr: Result<T, E>[]) => Result<T[], E>;
    any: <T, E>(arr: Result<T, E>[]) => Result<T, E[]>;
    from: <T, E>(raw: ResultRaw<T, E>) => Result<T, E>;
}
export declare const Result: Readonly<ResultT>;
type ResultRaw<T, E> = {
    v: T;
} | {
    e: E;
};
export { Err, Ok };
export { type ResultAsync, type ResultRaw, ErrAsync, OkAsync };
