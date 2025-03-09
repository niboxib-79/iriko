import { Err } from "./err";
import { Ok } from "./ok";
export type Result<T, E> = Ok<T, E> | Err<T, E>;
type ResultT = {
    try<T, E = unknown>(f: () => T): Result<T, E>;
    try_async<T, E = unknown>(f: () => Promise<T>): Promise<Result<T, E>>;
    try_promise<T, E = unknown>(p: Promise<T>): Promise<Result<Awaited<T>, E>>;
    all<T, E>(arr: Result<T, E>[]): Result<T[], E>;
    any<T, E>(arr: Result<T, E>[]): Result<T, E[]>;
};
export declare const Result: ResultT;
export { Err, Ok };
