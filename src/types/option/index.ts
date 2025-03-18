import { NoneAsync, type OptionAsync, OptionAsyncC, SomeAsync } from "./async";
import { None, NoneC } from "./none";
import { Some, SomeC } from "./some";

export type Option<T> = Some<T> | None<T>;

export type UnwrapO<T> = T extends Option<infer U> ? U : never;

type OptionT = {
    from<T>(v: T | null | undefined): Option<NonNullable<T>>;
    from<T>(v: null | undefined): None<T>;
    from<T>(v: T): Some<T>;
    all<T>(arr: Option<T>[]): Option<T[]>;
    all<T extends readonly unknown[] | []>(
        arr: T,
    ): Option<{ -readonly [I in keyof T]: UnwrapO<T[I]> }>;
    any<T>(arr: Option<T>[]): Option<T>;
    async<T>(p: Promise<Option<T>>): OptionAsync<T>;
    is(val: unknown): val is Option<unknown>;
};

export const Option: OptionT = {
    from: <T>(v: T | null | undefined) => {
        if (v === undefined || v === null) {
            return None() as never;
        } else {
            return Some<T>(v) as never;
        }
    },
    all: (arr: Option<unknown>[]) => {
        const res: unknown[] = [];
        for (const o of arr) {
            if (o.is_some()) {
                res.push(o.unwrap());
            } else {
                return None();
            }
        }
        return Some(res);
    },
    any: <T>(arr: Option<T>[]) => {
        for (const o of arr) {
            if (o.is_some()) {
                return o;
            }
        }
        return None();
    },
    async: <T>(p: Promise<Option<T>>) => new OptionAsyncC(p),
    is: (val: unknown) => {
        return val instanceof SomeC || val instanceof NoneC;
    },
};

export { None, Some, type OptionAsync, SomeAsync, NoneAsync };
