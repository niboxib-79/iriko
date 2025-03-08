import { None, Some } from "~/ns";
import { Err } from "./err";
import type { Result } from "./index";
declare class OkC<T, E> {
    private val;
    constructor(val: T);
    unwrap(): T;
    unwrap_or(_d: T): T;
    unwrap_or_else(_f: () => T): T;
    unwrap_err(): E;
    is_ok(): this is Ok<T, E>;
    is_ok_and(f: (val: T) => boolean): boolean;
    is_err(): this is Err<T, E>;
    is_err_and(_f: (arg0: E) => boolean): boolean;
    map<U>(f: (val: T) => U): Ok<U, E>;
    map_async<U>(f: (val: T) => Promise<U>): Promise<Ok<U, E>>;
    map_err<F>(_f: (arg0: E) => F): Ok<T, F>;
    and<U>(rb: Result<U, E>): Result<U, E>;
    flat_map<U>(f: (val: T) => Result<U, E>): Result<U, E>;
    or<F>(_rb: Result<T, F>): Ok<T, F>;
    or_else<F>(_f: (arg0: E) => Result<T, F>): Ok<T, F>;
    ok(): Some<T>;
    err(): None<E>;
    invert(): Err<E, T>;
    throw(): T;
}
export interface Ok<T, E> extends OkC<T, E> {
}
export declare const Ok: <T = unknown, E = any>(val: T) => OkC<T, E>;
export {};
