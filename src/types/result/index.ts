import { ErrAsync, OkAsync, type ResultAsync, ResultAsyncC } from "./async";
import { Err } from "./err";
import { Ok } from "./ok";

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export type UnwrapR<T> = T extends Result<infer U, infer _> ? U : never;

interface ResultT {
    try: <T, E = unknown>(f: () => T) => Result<T, E>;
    try_async: <T, E = unknown>(f: () => Promise<T>) => Promise<Result<T, E>>;
    try_promise: <T, E = unknown>(
        p: Promise<T>,
    ) => Promise<Result<Awaited<T>, E>>;
    async: <T, E>(p: Promise<Result<T, E>>) => ResultAsync<T, E>;
    all: <T, E>(arr: Result<T, E>[]) => Result<T[], E>;
    any: <T, E>(arr: Result<T, E>[]) => Result<T, E[]>;
    from: <T, E>(raw: ResultRaw<T, E>) => Result<T, E>;
}

export const Result: Readonly<ResultT> = Object.freeze({
    try: <T, E = unknown>(f: () => T) => {
        try {
            const v = f();
            return Ok(v);
        } catch (e) {
            return Err(e as E);
        }
    },
    try_async: async <T, E = unknown>(f: () => Promise<T>) => {
        try {
            const v = await f();
            return Ok(v);
        } catch (e) {
            return Err(e as E);
        }
    },
    try_promise: async <T, E = unknown>(p: Promise<T>) => {
        try {
            const v = await p;
            return Ok(v);
        } catch (e) {
            return Err(e as E);
        }
    },
    async: <T, E>(p: Promise<Result<T, E>>) => new ResultAsyncC(p),
    all: <T, E>(arr: Result<T, E>[]) => {
        const res = [];
        for (const o of arr) {
            if (o.is_ok()) {
                res.push(o.unwrap());
            } else {
                return o as Result<T[], E>;
            }
        }
        return Ok(res);
    },
    any: <T, E>(arr: Result<T, E>[]) => {
        const err = [];
        for (const o of arr) {
            if (o.is_ok()) {
                return o as Result<T, E[]>;
            } else {
                err.push(o.unwrap_err());
            }
        }
        return Err(err);
    },
    from: <T, E>(raw: ResultRaw<T, E>) => {
        if ("v" in raw) return Ok(raw.v);
        else return Err(raw.e);
    },
});

type ResultRaw<T, E> = { v: T } | { e: E };

export { Err, Ok };
export { type ResultAsync, type ResultRaw, ErrAsync, OkAsync };
