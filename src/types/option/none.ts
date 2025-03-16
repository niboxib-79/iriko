import { Err } from "../result/index";
import type { Option } from "./index";
import type { Some } from "./some";

class NoneC<T> {
    public unwrap(): never {
        throw new Error("tried to unwrap None value");
    }
    public unwrap_or(alt: T): T {
        return alt;
    }
    public unwrap_or_else(f: () => T): T {
        return f();
    }
    public is_some(): this is Some<T> {
        return false;
    }
    public is_some_and(_f: (val: T) => boolean): boolean {
        return false;
    }
    public is_none(): this is None<T> {
        return true;
    }
    public is_none_or(_f: (val: T) => boolean): boolean {
        return true;
    }
    public map<U>(_f: (val: T) => U): None<U> {
        return this as unknown as None<U>;
    }
    public flat_map<U>(_f: (val: T) => Option<U>): None<U> {
        return this as unknown as None<U>;
    }
    public and<U>(_ob: Option<U>): None<U> {
        return this as unknown as None<U>;
    }
    public or(ob: Option<T>): Option<T> {
        return ob;
    }
    public or_else(f: () => Option<T>): Option<T> {
        return f();
    }
    public ok_or<E>(e: E): Err<T, E> {
        return Err(e) as Err<T, E>;
    }
    public ok_or_else<E>(f: () => E): Err<T, E> {
        return Err(f()) as Err<T, E>;
    }
    public filter(_f: (val: T) => boolean): None<T> {
        return this;
    }
    public zip<U>(_ob: Option<U>): None<[T, U]> {
        return this as None<[T, U]>;
    }
    public raw(): undefined {
        return undefined;
    }
}

export interface None<T> extends NoneC<T> {}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const None = <T = any>(): Option<T> => new NoneC();
