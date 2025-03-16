import { Some } from "~/ns";
import type { OptionAsync } from "./index";
import { NoneAsync } from "./none";
import { OkAsync } from "../result_async/ok";

class SomeAsyncC<T> implements PromiseLike<Some<T>> {
    constructor(private val: Promise<T>) {}
    // biome-ignore lint/suspicious/noThenProperty: <explanation>
    then<TR1, TR2>(
        onfulfilled?:
            | ((value: Some<T>) => TR1 | PromiseLike<TR1>)
            | null
            | undefined,
        onrejected?:
            | ((reason: unknown) => TR2 | PromiseLike<TR2>)
            | null
            | undefined,
    ): PromiseLike<TR1 | TR2> {
        return this.val.then(
            onfulfilled
                ? (val) => onfulfilled(Some(val) as Some<T>)
                : undefined,
            onrejected,
        );
    }
    public unwrap(): Promise<T> {
        return this.val;
    }
    public unwrap_or(_alt: T): Promise<T> {
        return this.val;
    }
    public unwrap_or_else(_f: () => T): Promise<T> {
        return this.val;
    }
    public is_some(): this is SomeAsync<T> {
        return true;
    }
    public is_some_and(f: (val: T) => boolean): Promise<boolean> {
        return this.val.then(f);
    }
    public is_none(): this is NoneAsync<T> {
        return false;
    }
    public is_none_or(f: (val: T) => boolean): Promise<boolean> {
        return this.val.then(f);
    }
    public map<U>(f: (val: T) => U): SomeAsync<U> {
        return new SomeAsyncC(this.val.then(f));
    }
    public flat_map<U>(f: (val: T) => OptionAsync<U>): OptionAsync<U> {
        try {
            return new SomeAsyncC(
                this.val.then<U>((val) => {
                    const res = f(val);
                    return res.unwrap();
                }),
            );
        } catch {
            return NoneAsync();
        }
    }
    public and<U>(ob: OptionAsync<U>): OptionAsync<U> {
        return ob;
    }
    public or(_ob: OptionAsync<T>): OptionAsync<T> {
        return this;
    }
    public or_else(_f: () => OptionAsync<T>): OptionAsync<T> {
        return this;
    }
    public ok_or<E>(_e: E): OkAsync<T, E> {
        return OkAsync(this.val) as OkAsync<T, E>;
    }
    public ok_or_else<E>(_f: () => E): OkAsync<T, E> {
        return OkAsync(this.val) as OkAsync<T, E>;
    }
    public filter(f: (val: T) => boolean): OptionAsync<T> {
        return this.flat_map((v) => (f(v) ? Some(v).async() : NoneAsync()));
    }
    public zip<U>(ob: OptionAsync<U>): OptionAsync<[T, U]> {
        if (ob.is_some())
            return new SomeAsyncC(Promise.all([this.val, ob.val]));
        else return NoneAsync();
    }
    public raw(): Promise<T> {
        return this.val;
    }
}

export interface SomeAsync<T> extends SomeAsyncC<T> {}
export const SomeAsync = <T = unknown>(v: Promise<T>): OptionAsync<T> =>
    new SomeAsyncC(v);
