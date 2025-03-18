import { Option } from "~/ns";
import type { OptionAsync } from "../option/async";
import { Err, Ok, type Result } from "./index";

export class ResultAsyncC<T, E> implements PromiseLike<Result<T, E>> {
    constructor(private body: Promise<Result<T, E>>) {}
    // biome-ignore lint/suspicious/noThenProperty: <explanation>
    then<TResult1 = Result<T, E>, TResult2 = never>(
        onfulfilled?:
            | ((value: Result<T, E>) => TResult1 | PromiseLike<TResult1>)
            | null
            | undefined,
        onrejected?:
            | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
            | null
            | undefined,
    ): PromiseLike<TResult1 | TResult2> {
        return this.body.then(onfulfilled, onrejected);
    }
    public unwrap(): Promise<T> {
        return this.body.then((r) => r.unwrap());
    }
    public unwrap_or(alt: T): Promise<T> {
        return this.body.then((r) => r.unwrap_or(alt));
    }
    public unwrap_or_else(f: () => T): Promise<T> {
        return this.body.then((r) => r.unwrap_or(f()));
    }
    public is_ok(): Promise<boolean> {
        return this.body.then((r) => r.is_ok());
    }
    public is_ok_and(f: (val: T) => boolean): Promise<boolean> {
        return this.body.then((r) => r.is_ok_and(f));
    }
    public is_err(): Promise<boolean> {
        return this.body.then((r) => r.is_err());
    }
    public is_err_or(f: (val: E) => boolean): Promise<boolean> {
        return this.body.then((r) => r.is_err_and(f));
    }
    public map<U>(f: (val: T) => U): ResultAsync<U, E> {
        return new ResultAsyncC<U, E>(this.body.then((r) => r.map(f)));
    }
    public map_async<U>(f: (val: T) => Promise<U>): ResultAsync<U, E> {
        return new ResultAsyncC(
            this.body.then(async (r) => {
                if (r.is_ok()) {
                    return Ok(await f(r.unwrap()));
                } else {
                    return r as unknown as Err<U, E>;
                }
            }),
        );
    }
    public flat_map<U>(f: (val: T) => ResultAsync<U, E>): ResultAsync<U, E> {
        return new ResultAsyncC(
            this.body.then((r) => {
                if (r.is_ok()) {
                    return f(r.unwrap());
                } else {
                    return r as unknown as Err<U, E>;
                }
            }),
        );
    }
    public and<U>(ob: ResultAsync<U, E>): ResultAsync<U, E> {
        return new ResultAsyncC(
            this.body.then(async (r) => {
                if (r.is_ok()) return ob;
                else return r as unknown as Result<U, E>;
            }),
        );
    }
    public or(ob: ResultAsync<T, E>): ResultAsync<T, E> {
        return new ResultAsyncC(
            this.body.then(async (r) => {
                if (r.is_ok()) return r;
                else return ob;
            }),
        );
    }
    public or_else(f: () => ResultAsync<T, E>): ResultAsync<T, E> {
        return new ResultAsyncC(
            this.body.then(async (r) => {
                if (r.is_ok()) return r;
                else return f();
            }),
        );
    }
    public ok(): OptionAsync<T> {
        return Option.async(this.body.then((r) => r.ok()));
    }
    public err(): OptionAsync<E> {
        return Option.async(this.body.then((r) => r.err()));
    }
    public invert(): ResultAsync<E, T> {
        return new ResultAsyncC(this.body.then((r) => r.invert()));
    }
}

export interface ResultAsync<T, E> extends ResultAsyncC<T, E> {}

export const ErrAsync = <T, E>(e: E) =>
    new ResultAsyncC(Promise.resolve(Err<T, E>(e)));
export const OkAsync = <T, E>(val: T) =>
    new ResultAsyncC(Promise.resolve(Ok<T, E>(val)));
