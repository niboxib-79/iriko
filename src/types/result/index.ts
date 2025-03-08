import { Err } from "./err";
import { Ok } from "./ok";

export type Result<T, E> = Ok<T, E> | Err<T, E>;

type ResultT = {
    try<T, E = unknown>(f: () => T): Result<T, E>;
    try_async<T, E = unknown>(f: () => Promise<T>): Promise<Result<T, E>>;
    try_promise<T, E = unknown>(p: Promise<T>): Promise<Result<T, E>>;
    all<T, E>(arr: Result<T, E>[]): Result<T[], E>;
    any<T, E>(arr: Result<T, E>[]): Result<T, E[]>;
};

export const Result: ResultT = {
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
};

export { Err, Ok };
