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
export declare const Option: OptionT;
export { None, Some };
