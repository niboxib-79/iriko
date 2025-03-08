import { None } from "./none";
import { Some } from "./some";

export type Option<T> = Some<T> | None<T>;

type OptionT = {
    from<T>(v: T | null | undefined): Option<NonNullable<T>>;
    from<T>(v: null | undefined): None<T>;
    from<T>(v: T): Some<T>;
    all<T>(arr: Option<T>[]): Option<T[]>;
    any<T>(arr: Option<T>[]): Option<T>;
};

export const Option: OptionT = {
    from: <T>(v: T | null | undefined) => {
        if (v === undefined || v === null) {
            return None() as never;
        } else {
            return Some<T>(v) as never;
        }
    },
    all: <T>(arr: Option<T>[]) => {
        const res = [];
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
};

export { None, Some };
