import { Ok } from "~/ns";
import type { Option } from "./index";
import { None } from "./none";
declare class SomeC<T> {
    private val;
    constructor(val: T);
    unwrap(): T;
    unwrap_or(alt: T): T;
    unwrap_or_else(f: () => T): T;
    is_some(): this is Some<T>;
    is_some_and(f: (val: T) => boolean): boolean;
    is_none(): this is None<T>;
    is_none_or(f: (val: T) => boolean): boolean;
    map<U>(f: (val: T) => U): Some<U>;
    flat_map<U>(f: (val: T) => Option<U>): Option<U>;
    and<U>(ob: Option<U>): Option<U>;
    or(_ob: Option<T>): Some<T>;
    or_else(_f: () => Option<T>): Some<T>;
    ok_or<E>(_e: E): Ok<T, E>;
    ok_or_else<E>(_f: () => E): Ok<T, E>;
    filter(f: (val: T) => boolean): Option<T>;
    zip<U>(ob: Option<U>): Option<[T, U]>;
    raw(): T;
}
export interface Some<T> extends SomeC<T> {
}
export declare const Some: <T = unknown>(v: T) => Option<T>;
export {};
