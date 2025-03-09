import { None, Some } from "~/ns";
import type { Result } from "./index";
import { Ok } from "./ok";
declare class ErrC<T, E> {
    private e;
    constructor(e: E);
    unwrap(): never;
    unwrap_or(d: T): T;
    unwrap_or_else(f: () => T): T;
    unwrap_err(): E;
    is_ok(): this is Ok<T, E>;
    is_ok_and(_f: (val: T) => boolean): boolean;
    is_err(): this is Err<T, E>;
    is_err_and(f: (arg0: E) => boolean): boolean;
    map<U>(_f: (val: T) => U): Err<U, E>;
    map_async<U>(_f: (val: T) => Promise<U>): Promise<Err<U, E>>;
    map_err<F>(f: (arg0: E) => F): Err<T, F>;
    and<U>(_rb: Result<U, E>): Err<U, E>;
    flat_map<U>(_f: (val: T) => Result<U, E>): Err<U, E>;
    or<F>(rb: Result<T, F>): Result<T, F>;
    or_else<F>(f: (arg0: E) => Result<T, F>): Result<T, F>;
    ok(): None<T>;
    err(): Some<E>;
    invert(): Ok<E, T>;
    throw(): never;
}
export interface Err<T, E> extends ErrC<T, E> {
}
export declare const Err: <T = any, E = unknown>(e: E) => Result<T, E>;
export {};
