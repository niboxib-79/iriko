import { Ok, type Result } from "~/ns";
import type { Option } from "./index";
import { None } from "./none";

class SomeC<T> {
    constructor(private val: T) {}
    public unwrap(): T {
        return this.val;
    }
    public unwrap_or(alt: T): T {
        return this.val;
    }
    public unwrap_or_else(f: () => T): T {
        return this.val;
    }
    public is_some(): this is Some<T> {
        return true;
    }
    public is_some_and(f: (val: T) => boolean): boolean {
        return f(this.val);
    }
    public is_none(): this is None<T> {
        return false;
    }
    public is_none_or(f: (val: T) => boolean): boolean {
        return f(this.val);
    }
    public map<U>(f: (val: T) => U): Some<U> {
        return new SomeC(f(this.val));
    }
    public flat_map<U>(f: (val: T) => Option<U>): Option<U> {
        return f(this.val);
    }
    public and<U>(ob: Option<U>): Option<U> {
        return ob;
    }
    public or(_ob: Option<T>): Some<T> {
        return this;
    }
    public or_else(_f: () => Option<T>): Some<T> {
        return this;
    }
    public ok_or<E>(_e: E): Ok<T, E> {
        return Ok(this.val) as Ok<T, E>;
    }
    public ok_or_else<E>(_f: () => E): Ok<T, E> {
        return Ok(this.val) as Ok<T, E>;
    }
    public filter(f: (val: T) => boolean): Option<T> {
        return f(this.val) ? this : None();
    }
    public zip<U>(ob: Option<U>): Option<[T, U]> {
        if (ob.is_some()) return new SomeC([this.val, ob.val]);
        else return None();
    }
    public raw(): T {
        return this.val;
    }
}

export interface Some<T> extends SomeC<T> {}
export const Some = <T = unknown>(v: T): Option<T> => new SomeC(v);
