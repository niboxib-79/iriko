import { None } from "~/ns";
import type { OptionAsync } from "./index";
import type { SomeAsync } from "./some";

class NoneAsyncC<T> implements PromiseLike<None<T>> {
    public unwrap(): never {
        throw new Error("tried to unwrap None value");
    }
    // biome-ignore lint/suspicious/noThenProperty: <explanation>
    then<TR1, TR2>(
        onfulfilled?:
            | ((value: None<T>) => TR1 | PromiseLike<TR1>)
            | null
            | undefined,
        onrejected?:
            | ((reason: unknown) => TR2 | PromiseLike<TR2>)
            | null
            | undefined,
    ): PromiseLike<TR1 | TR2> {
        return new Promise((resolve) => resolve).then(
            onfulfilled ? () => onfulfilled(None() as None<T>) : undefined,
            onrejected,
        );
    }
    public async unwrap_or(alt: T): Promise<T> {
        return alt;
    }
    public async unwrap_or_else(f: () => T): Promise<T> {
        return f();
    }
    public is_some(): this is SomeAsync<T> {
        return false;
    }
    public async is_some_and(_f: (val: T) => boolean): Promise<boolean> {
        return false;
    }
    public is_none(): this is NoneAsync<T> {
        return true;
    }
    public async is_none_or(_f: (val: T) => boolean): Promise<boolean> {
        return true;
    }
    public map<U>(_f: (val: T) => U): NoneAsync<U> {
        return this as unknown as NoneAsync<U>;
    }
    public flat_map<U>(_f: (val: T) => OptionAsync<U>): NoneAsync<U> {
        return this as unknown as NoneAsync<U>;
    }
    public and<U>(ob: OptionAsync<U>): OptionAsync<U> {
        return ob;
    }
    public or(ob: OptionAsync<T>): OptionAsync<T> {
        return ob;
    }
    public or_else(f: () => OptionAsync<T>): OptionAsync<T> {
        return f();
    }
    public filter(_f: (val: T) => boolean): OptionAsync<T> {
        return this;
    }
    public zip<U>(_ob: OptionAsync<U>): NoneAsync<[T, U]> {
        return NoneAsync() as NoneAsync<[T, U]>;
    }
    public raw(): Promise<undefined> {
        return new Promise((resolve) => resolve(undefined));
    }
}

export interface NoneAsync<T> extends NoneAsyncC<T> {}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const NoneAsync = <T = any>(): OptionAsync<T> => new NoneAsyncC();
