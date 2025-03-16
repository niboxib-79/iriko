import { Err } from "~/ns";
import type { ResultAsync } from "./index";
import type { OkAsync } from "./ok";
import { SomeAsync } from "../option_async/some";
import { NoneAsync } from "../option_async/index";

class ErrAsyncC<T, E> {
    constructor(private e: Promise<E>) {}

    // biome-ignore lint/suspicious/noThenProperty: <explanation>
    then<TR1, TR2>(
        onfulfilled?:
            | ((value: Err<T, E>) => TR1 | PromiseLike<TR1>)
            | null
            | undefined,
        onrejected?:
            | ((reason: unknown) => TR2 | PromiseLike<TR2>)
            | null
            | undefined,
    ): PromiseLike<TR1 | TR2> {
        return this.e.then(
            onfulfilled ? (e) => onfulfilled(Err(e) as Err<T, E>) : undefined,
            onrejected,
        );
    }
    public unwrap(): never {
        throw new Error("tried to unwrap Err value");
    }
    public unwrap_or(alt: T): Promise<T> {
        return new Promise((resolve) => resolve(alt));
    }
    public unwrap_or_else(f: (e: E) => T): Promise<T> {
        return this.e.then(f);
    }
    public unwrap_err(): Promise<E> {
        return this.e;
    }
    public is_ok(): this is OkAsync<T, E> {
        return false;
    }
    public is_ok_and(_f: (val: T) => boolean): Promise<boolean> {
        return new Promise((resolve) => resolve(false));
    }
    public is_err(): this is ErrAsync<T, E> {
        return true;
    }
    public is_err_or(_f: (val: T) => boolean): Promise<boolean> {
        return new Promise((resolve) => resolve(false));
    }
    public map<U>(_f: (val: T) => U): ErrAsync<U, E> {
        return this as unknown as ErrAsync<U, E>;
    }
    public map_err<F>(_f: (val: E) => F): OkAsync<T, F> {
        return this as unknown as OkAsync<T, F>;
    }
    public map_async<U>(_f: (val: T) => Promise<U>): ErrAsync<U, E> {
        return this as unknown as ErrAsync<U, E>;
    }
    public flat_map<U>(_f: (val: T) => ResultAsync<U, E>): ErrAsync<U, E> {
        return this as unknown as ErrAsync<U, E>;
    }
    public and<U>(_ob: ResultAsync<U, E>): ErrAsync<U, E> {
        return this as unknown as ErrAsync<U, E>;
    }
    public or(ob: ResultAsync<T, E>): ResultAsync<T, E> {
        return ob;
    }
    public or_else(_f: () => ResultAsync<T, E>): ResultAsync<T, E> {
        return this;
    }
    public ok(): NoneAsync<T> {
        return NoneAsync<T>() as NoneAsync<T>;
    }
    public err(): SomeAsync<E> {
        return SomeAsync<E>(this.e) as SomeAsync<E>;
    }
    public raw(): Promise<T> {
        return this.e.then((e) => new Promise((_, reject) => reject(e)));
    }
}

export interface ErrAsync<T, E> extends ErrAsyncC<T, E> {}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const ErrAsync = <T = any, E = unknown>(e: Promise<E>): ResultAsync<T, E> =>
    new ErrAsyncC<T, E>(e);
