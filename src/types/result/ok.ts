import { None, Some } from "~/ns";
import { Err } from "./err";
import type { Result } from "./index";

class OkC<T, E> {
    constructor(private val: T) {}

    public unwrap(): T {
        return this.val;
    }
    public unwrap_or(_d: T): T {
        return this.val;
    }
    public unwrap_or_else(_f: () => T): T {
        return this.val;
    }
    public unwrap_err(): E {
        throw new Error(`tried to unwrap_err Ok: ${this.val}`);
    }
    public is_ok(): this is Ok<T, E> {
        return true;
    }
    public is_ok_and(f: (val: T) => boolean): boolean {
        return f(this.val);
    }
    public is_err(): this is Err<T, E> {
        return false;
    }
    public is_err_and(_f: (arg0: E) => boolean): boolean {
        return false;
    }
    public map<U>(f: (val: T) => U): Ok<U, E> {
        return new OkC(f(this.val));
    }
    public map_err<F>(_f: (arg0: E) => F): Ok<T, F> {
        return this as unknown as Ok<T, F>;
    }
    public flat_map<U>(f: (val: T) => Result<U, E>): Result<U, E> {
        return f(this.val);
    }
    public and<U>(rb: Result<U, E>): Result<U, E> {
        return rb;
    }
    public or<F>(_rb: Result<T, F>): Ok<T, F> {
        return this as unknown as Ok<T, F>;
    }
    public or_else<F>(_f: (arg0: E) => Result<T, F>): Ok<T, F> {
        return this as unknown as Ok<T, F>;
    }
    public ok(): Some<T> {
        return Some<T>(this.val) as Some<T>;
    }
    public err(): None<E> {
        return None<E>() as None<E>;
    }
    public invert(): Err<E, T> {
        return Err<E, T>(this.val) as Err<E, T>;
    }
    public throw(): T {
        throw this.val;
    }
}

export interface Ok<T, E> extends OkC<T, E> {}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const Ok = <T = unknown, E = any>(val: T): Result<T, E> =>
    new OkC<T, E>(val);
