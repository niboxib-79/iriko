import { Result } from "~/ns";
import type { ResultAsync } from "../result/async";
import { None, type Option, Some } from "./index";

export class OptionAsyncC<T> implements PromiseLike<Option<T>> {
    constructor(private body: Promise<Option<T>>) {}
    // biome-ignore lint/suspicious/noThenProperty: <explanation>
    then<TResult1 = Option<T>, TResult2 = never>(
        onfulfilled?:
            | ((value: Option<T>) => TResult1 | PromiseLike<TResult1>)
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
        return this.body.then((o) => o.unwrap());
    }
    public unwrap_or(alt: T): Promise<T> {
        return this.body.then((o) => o.unwrap_or(alt));
    }
    public unwrap_or_else(f: () => T): Promise<T> {
        return this.body.then((o) => o.unwrap_or(f()));
    }
    public is_some(): Promise<boolean> {
        return this.body.then((o) => o.is_some());
    }
    public is_some_and(f: (val: T) => boolean): Promise<boolean> {
        return this.body.then((o) => o.is_some_and(f));
    }
    public is_none(): Promise<boolean> {
        return this.body.then((o) => o.is_none());
    }
    public is_none_or(f: (val: T) => boolean): Promise<boolean> {
        return this.body.then((o) => o.is_none_or(f));
    }
    public map<U>(f: (val: T) => U): OptionAsync<U> {
        return new OptionAsyncC(this.body.then((o) => o.map(f)));
    }
    public map_async<U>(f: (val: T) => Promise<U>): OptionAsync<U> {
        return new OptionAsyncC(
            this.body.then(async (o) => {
                if (o.is_some()) {
                    return Some(await f(o.unwrap()));
                } else {
                    return None();
                }
            }),
        );
    }
    public flat_map<U>(f: (val: T) => OptionAsync<U>): OptionAsync<U> {
        return new OptionAsyncC(
            this.body.then((o) => {
                if (o.is_some()) {
                    return f(o.unwrap());
                } else {
                    return NoneAsync<U>();
                }
            }),
        );
    }
    public and<U>(ob: OptionAsync<U>): OptionAsync<U> {
        return new OptionAsyncC(
            this.body.then(async (o) => {
                if (o.is_some()) return ob;
                else return None();
            }),
        );
    }
    public or(ob: OptionAsync<T>): OptionAsync<T> {
        return new OptionAsyncC(
            this.body.then(async (o) => {
                if (o.is_some()) return o;
                else return ob;
            }),
        );
    }
    public or_else(f: () => OptionAsync<T>): OptionAsync<T> {
        return new OptionAsyncC(
            this.body.then(async (o) => {
                if (o.is_some()) return o;
                else return f();
            }),
        );
    }
    public ok_or<E>(e: E): ResultAsync<T, E> {
        return Result.async(this.body.then((o) => o.ok_or(e)));
    }
    public ok_or_else<E>(f: () => E): ResultAsync<T, E> {
        return Result.async(this.body.then((o) => o.ok_or_else(f)));
    }
    public filter(f: (val: T) => boolean): OptionAsync<T> {
        return new OptionAsyncC(this.body.then((o) => o.filter(f)));
    }
    public zip<U>(ob: OptionAsync<U>): OptionAsync<[T, U]> {
        return new OptionAsyncC(
            (async () => {
                return (await this.body).zip(await ob);
            })(),
        );
    }
}

export interface OptionAsync<T> extends OptionAsyncC<T> {}

export const NoneAsync = <T>() => new OptionAsyncC(Promise.resolve(None<T>()));
export const SomeAsync = <T>(val: T) =>
    new OptionAsyncC(Promise.resolve(Some<T>(val)));
