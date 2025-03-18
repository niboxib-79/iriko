import { NoneAsync, type OptionAsync, SomeAsync } from "./async";
import { None } from "./none";
import { Some } from "./some";
export type Option<T> = Some<T> | None<T>;
export type UnwrapO<T> = T extends Option<infer U> ? U : never;
type OptionT = {
    from<T>(v: T | null | undefined): Option<NonNullable<T>>;
    from<T>(v: null | undefined): None<T>;
    from<T>(v: T): Some<T>;
    all<T>(arr: Option<T>[]): Option<T[]>;
    all<T extends readonly unknown[] | []>(arr: T): Option<{
        -readonly [I in keyof T]: UnwrapO<T[I]>;
    }>;
    any<T>(arr: Option<T>[]): Option<T>;
    async<T>(p: Promise<Option<T>>): OptionAsync<T>;
    is(val: unknown): val is Option<unknown>;
};
export declare const Option: OptionT;
export { None, Some, type OptionAsync, SomeAsync, NoneAsync };
