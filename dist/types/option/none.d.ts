import { Err } from "../result/index";
import { type Option, type OptionAsync } from "./index";
import type { Some } from "./some";
export declare class NoneC<T> {
    unwrap(): never;
    unwrap_or(alt: T): T;
    unwrap_or_else(f: () => T): T;
    is_some(): this is Some<T>;
    is_some_and(_f: (val: T) => boolean): boolean;
    is_none(): this is None<T>;
    is_none_or(_f: (val: T) => boolean): boolean;
    map<U>(_f: (val: T) => U): None<U>;
    flat_map<U>(_f: (val: T) => Option<U>): None<U>;
    and<U>(_ob: Option<U>): None<U>;
    or(ob: Option<T>): Option<T>;
    or_else(f: () => Option<T>): Option<T>;
    ok_or<E>(e: E): Err<T, E>;
    ok_or_else<E>(f: () => E): Err<T, E>;
    filter(_f: (val: T) => boolean): None<T>;
    zip<U>(_ob: Option<U>): None<[T, U]>;
    raw(): undefined;
    async(): OptionAsync<T>;
    private cast;
}
export interface None<T> extends NoneC<T> {
}
export declare const None: <T = any>() => Option<T>;
