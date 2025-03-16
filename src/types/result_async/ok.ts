import { Ok } from "~/ns";
import type { ResultAsync } from "./index";
import { ErrAsync } from "./err";
import { SomeAsync } from "../option_async/some";
import { NoneAsync } from "../option_async/none";

class OkAsyncC<T, E> {
    constructor(private val: Promise<T>) {}

    // biome-ignore lint/suspicious/noThenProperty: <explanation>
    then<TR1, TR2>(
        onfulfilled?:
            | ((value: Ok<T, E>) => TR1 | PromiseLike<TR1>)
            | null
            | undefined,
        onrejected?:
            | ((reason: unknown) => TR2 | PromiseLike<TR2>)
            | null
            | undefined,
    ): PromiseLike<TR1 | TR2> {
        return this.val.then(
            onfulfilled ? (val) => onfulfilled(Ok(val) as Ok<T, E>) : undefined,
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
    public unwrap_err(): never {
        throw new Error(`tried to unwrap_err Ok: ${this.val}`);
    }
    public is_ok(): this is OkAsync<T, E> {
        return true;
    }
    public is_ok_and(f: (val: T) => boolean): Promise<boolean> {
        return this.val.then(f);
    }
    public is_err(): this is ErrAsync<T, E> {
        return false;
    }
    public is_err_or(f: (val: T) => boolean): Promise<boolean> {
        return this.val.then(f);
    }
    public map<U>(f: (val: T) => U): OkAsync<U, E> {
        return new OkAsyncC(this.val.then(f));
    }
    public map_err<F>(_f: (val: E) => F): OkAsync<T, F> {
        return this as unknown as OkAsync<T, F>;
    }
    public map_async<U>(f: (val: T) => Promise<U>): OkAsync<U, E> {
        return new OkAsyncC(this.val.then(f));
    }
    public flat_map<U>(f: (val: T) => ResultAsync<U, E>): ResultAsync<U, E> {
        const p = this.val.then<ResultAsync<U, E>>((val) => {
            const res = f(val);
            return res;
        });
        try {
            const p2 = p.then((res) => res.unwrap());
            return OkAsync(p2);
        } catch {
            return ErrAsync(p.then((res) => res.unwrap_err()));
        }
    }
    public and<U>(ob: ResultAsync<U, E>): ResultAsync<U, E> {
        return ob;
    }
    public or(_ob: ResultAsync<T, E>): ResultAsync<T, E> {
        return this;
    }
    public or_else(_f: () => ResultAsync<T, E>): ResultAsync<T, E> {
        return this;
    }
    public ok(): SomeAsync<T> {
        return SomeAsync<T>(this.val) as SomeAsync<T>;
    }
    public err(): NoneAsync<E> {
        return NoneAsync<E>() as NoneAsync<E>;
    }
    public raw(): Promise<T> {
        return this.val;
    }
}

export interface OkAsync<T, E> extends OkAsyncC<T, E> {}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const OkAsync = <T = unknown, E = any>(
    val: Promise<T>,
): ResultAsync<T, E> => new OkAsyncC<T, E>(val);
