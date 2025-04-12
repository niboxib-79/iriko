import { type Option } from "./ns";
interface RawDeque<T> {
    stack_front: T[];
    stack_back: T[];
}
type Callback<T, U = void> = (value: T, index: number) => U;
export interface Deque<T> {
    [i: number]: T;
    readonly length: number;
    readonly at: (i: number) => Option<T>;
    readonly push_front: (v: T) => number;
    readonly pop_front: () => Option<T>;
    readonly push_back: (v: T) => number;
    readonly pop_back: () => Option<T>;
    readonly for_each: (callbackfn: Callback<T>) => void;
    readonly map: <U>(f: (v: T) => U) => Deque<U>;
    readonly flat_map: <U>(f: (v: T) => Deque<U>) => Deque<U>;
    readonly fold: <U>(init: U, f: (acc: U, current: T) => U) => U;
    readonly clone: () => Deque<T>;
    readonly values: () => Generator<T>;
    readonly keys: () => Generator<number>;
    readonly entries: () => Generator<[number, T]>;
    readonly [Symbol.iterator]: () => Generator<T>;
}
interface DequeT {
    new: <T>() => Deque<T>;
    from<T>(init: T[]): Deque<T>;
    from<T>(init: Deque<T>): Deque<T>;
    from<T>(init: RawDeque<T>): Deque<T>;
    is_deque<T = unknown>(v: unknown): v is Deque<T>;
    [Symbol.hasInstance](v: unknown): boolean;
}
type DequeC = Readonly<DequeT> & {
    new <T>(): Deque<T>;
};
export declare const Deque: DequeC;
export {};
