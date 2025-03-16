import { None, Some } from "~/ns";
import type { Result } from "./index";
import { Ok } from "./ok";

class ErrC<T, E> {
    constructor(private e: E) {}

    public unwrap(): never {
        throw new Error(`tried to unwrap Err value: ${this.e}`);
    }
    public unwrap_or(d: T): T {
        return d;
    }
    public unwrap_or_else(f: () => T): T {
        return f();
    }
    public unwrap_err(): E {
        return this.e;
    }
    public is_ok(): this is Ok<T, E> {
        return false;
    }
    public is_ok_and(_f: (val: T) => boolean): boolean {
        return false;
    }
    public is_err(): this is Err<T, E> {
        return true;
    }
    public is_err_and(f: (arg0: E) => boolean): boolean {
        return f(this.e);
    }
    public map<U>(_f: (val: T) => U): Err<U, E> {
        return this as unknown as Err<U, E>;
    }
    public map_err<F>(f: (arg0: E) => F): Err<T, F> {
        return new ErrC<T, F>(f(this.e));
    }
    public flat_map<U>(_f: (val: T) => Result<U, E>): Err<U, E> {
        return this as unknown as Err<U, E>;
    }
    public and<U>(_rb: Result<U, E>): Err<U, E> {
        return this as unknown as Err<U, E>;
    }
    public or<F>(rb: Result<T, F>): Result<T, F> {
        return rb;
    }
    public or_else<F>(f: (arg0: E) => Result<T, F>): Result<T, F> {
        return f(this.e);
    }
    public ok(): None<T> {
        return None<T>() as None<T>;
    }
    public err(): Some<E> {
        return Some<E>(this.e) as Some<E>;
    }
    public invert(): Ok<E, T> {
        return Ok<E, T>(this.e) as Ok<E, T>;
    }
    public throw(): never {
        throw this.e;
    }
}

export interface Err<T, E> extends ErrC<T, E> {}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const Err = <T = any, E = unknown>(e: E): Result<T, E> =>
    new ErrC<T, E>(e);
