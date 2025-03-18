import type { ResultAsync } from "../result/async";
import { type Option } from "./index";
export declare class OptionAsyncC<T> implements PromiseLike<Option<T>> {
    private body;
    constructor(body: Promise<Option<T>>);
    then<TResult1 = Option<T>, TResult2 = never>(onfulfilled?: ((value: Option<T>) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2>;
    unwrap(): Promise<T>;
    unwrap_or(alt: T): Promise<T>;
    unwrap_or_else(f: () => T): Promise<T>;
    is_some(): Promise<boolean>;
    is_some_and(f: (val: T) => boolean): Promise<boolean>;
    is_none(): Promise<boolean>;
    is_none_or(f: (val: T) => boolean): Promise<boolean>;
    map<U>(f: (val: T) => U): OptionAsync<U>;
    map_async<U>(f: (val: T) => Promise<U>): OptionAsync<U>;
    flat_map<U>(f: (val: T) => OptionAsync<U>): OptionAsync<U>;
    and<U>(ob: OptionAsync<U>): OptionAsync<U>;
    or(ob: OptionAsync<T>): OptionAsync<T>;
    or_else(f: () => OptionAsync<T>): OptionAsync<T>;
    ok_or<E>(e: E): ResultAsync<T, E>;
    ok_or_else<E>(f: () => E): ResultAsync<T, E>;
    filter(f: (val: T) => boolean): OptionAsync<T>;
    zip<U>(ob: OptionAsync<U>): OptionAsync<[T, U]>;
}
export interface OptionAsync<T> extends OptionAsyncC<T> {
}
export declare const NoneAsync: <T>() => OptionAsyncC<T>;
export declare const SomeAsync: <T>(val: T) => OptionAsyncC<T>;
