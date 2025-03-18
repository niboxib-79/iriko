import type { OptionAsync } from "../option/async";
import { type Result } from "./index";
export declare class ResultAsyncC<T, E> implements PromiseLike<Result<T, E>> {
    private body;
    constructor(body: Promise<Result<T, E>>);
    then<TResult1 = Result<T, E>, TResult2 = never>(onfulfilled?: ((value: Result<T, E>) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2>;
    unwrap(): Promise<T>;
    unwrap_or(alt: T): Promise<T>;
    unwrap_or_else(f: () => T): Promise<T>;
    is_ok(): Promise<boolean>;
    is_ok_and(f: (val: T) => boolean): Promise<boolean>;
    is_err(): Promise<boolean>;
    is_err_or(f: (val: E) => boolean): Promise<boolean>;
    map<U>(f: (val: T) => U): ResultAsync<U, E>;
    map_async<U>(f: (val: T) => Promise<U>): ResultAsync<U, E>;
    flat_map<U>(f: (val: T) => ResultAsync<U, E>): ResultAsync<U, E>;
    and<U>(ob: ResultAsync<U, E>): ResultAsync<U, E>;
    or(ob: ResultAsync<T, E>): ResultAsync<T, E>;
    or_else(f: () => ResultAsync<T, E>): ResultAsync<T, E>;
    ok(): OptionAsync<T>;
    err(): OptionAsync<E>;
    invert(): ResultAsync<E, T>;
}
export interface ResultAsync<T, E> extends ResultAsyncC<T, E> {
}
export declare const ErrAsync: <T, E>(e: E) => ResultAsyncC<T, E>;
export declare const OkAsync: <T, E>(val: T) => ResultAsyncC<T, E>;
