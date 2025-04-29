import { None, type Option, Some } from "./ns";

interface RawDeque<T> {
    head: number;
    tail: number;
    body: (T | undefined)[];
    length: number;
}

const b_grow = <T>(self: RawDeque<T>) => {
    const new_body: (T | undefined)[] = [];
    const new_cap = self.body.length === 0 ? 4 : self.body.length * 2;
    for (let i = 0; i < new_cap; i++) {
        if (i < self.length) {
            new_body.push(b_at(self, i));
        } else {
            new_body.push(undefined);
        }
    }
    self.head = 0;
    self.tail = self.length - 1;
    self.body = new_body;
};

const b_push_front = <T>(self: RawDeque<T>, val: T) => {
    if (self.length === self.body.length) b_grow(self);
    self.head = (self.head - 1 + self.body.length) % self.body.length;
    self.body[self.head] = val;
    self.length += 1;
    return self.length;
};

const b_pop_front = <T>(self: RawDeque<T>) => {
    if (self.length === 0) return None();
    const val = self.body[self.head] as T;
    self.body[self.head] = undefined;
    self.head += 1;
    self.length -= 1;
    return Some(val);
};

const b_push_back = <T>(self: RawDeque<T>, val: T) => {
    if (self.length === self.body.length) b_grow(self);
    self.head = (self.tail + 1) % self.body.length;
    self.body[self.tail] = val;
    self.length += 1;
    return self.length;
};

const b_pop_back = <T>(self: RawDeque<T>) => {
    if (self.length === 0) return None();
    const val = self.body[self.tail] as T;
    self.body[self.tail] = undefined;
    self.tail -= 1;
    self.length -= 1;
    return Some(val);
};

const b_at = <T>(self: RawDeque<T>, i: number) => {
    if (!(0 <= i && i < self.length)) return;
    const j = (i + self.head) % self.body.length;
    return self.body[j];
};

const b_at_opt = <T>(self: RawDeque<T>, i: number) => {
    if (!(0 <= i && i < self.length)) return None();
    const j = (i + self.head) % self.body.length;
    return Some(self.body[j]);
};

const b_set_i = <T>(self: RawDeque<T>, i: number, val: T) => {
    if (!(0 <= i && i < self.length)) return false;
    const j = (i + self.head) % self.body.length;
    self.body[j] = val;
    return true;
};

type Callback<T, U = void> = (value: T, index: number) => U;

const b_for_each = <T>(self: RawDeque<T>, f: Callback<T, void>) => {
    for (let i = 0; i < self.length; i++) f(b_at(self, i)!, i);
};

const b_map = <T, U>(self: RawDeque<T>, f: Callback<T, U>): RawDeque<U> => {
    const res: RawDeque<U> = {
        head: 0,
        tail: self.length - 1,
        body: [],
        length: self.length,
    };
    for (let i = 0; i < self.length; i++) res.body.push(f(b_at(self, i)!, i));
    return res;
};

const b_flat_map = <T, U>(
    self: RawDeque<T>,
    f: Callback<T, RawDeque<U>>,
): RawDeque<U> => {
    const res: RawDeque<U> = {
        head: 0,
        tail: self.length - 1,
        body: [],
        length: self.length,
    };
    for (let i = 0; i < self.length; i++)
        res.body.push(...b_values(f(b_at(self, i)!, i)));
    return res;
};

const b_fold = <T, U>(self: RawDeque<T>, init: U, f: (a: U, c: T) => U) => {
    let a = init;
    for (let i = 0; i < self.length; i++) a = f(a, b_at(self, i)!);
    return a;
};

const b_values = function* <T>(self: RawDeque<T>): Generator<T> {
    for (let i = 0; i < self.length; i++) yield b_at(self, i) as T;
};

const b_keys = function* <T>(self: RawDeque<T>): Generator<number> {
    for (let i = 0; i < self.length; i++) yield i;
};

const b_entries = function* <T>(self: RawDeque<T>): Generator<[number, T]> {
    for (let i = 0; i < self.length; i++) yield [i, b_at(self, i) as T];
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
const DequePrototype = Object.create(null) as {};

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

const DequeO = Object.freeze<DequeT>({
    new: <T>() => createDeque<T>({ head: 0, tail: -1, body: [], length: 0 }),
    from: <T>(init: T[] | Deque<T> | RawDeque<T>) => {
        if (Array.isArray(init))
            return createDeque<T>({
                head: 0,
                tail: init.length - 1,
                body: init,
                length: init.length,
            });
        if (Deque.is_deque<T>(init)) return init.clone();
        else return createDeque(init);
    },
    is_deque: <T = unknown>(v: unknown): v is Deque<T> =>
        Object.getPrototypeOf(v) === DequePrototype,
    [Symbol.hasInstance]: (v: unknown): boolean => DequeO.is_deque(v),
});

type DequeC = Readonly<DequeT> & { new <T>(): Deque<T> };

// biome-ignore lint/complexity/useArrowFunction: <explanation>
export const Deque: DequeC = new Proxy(function () {}, {
    get: (_, p) => DequeO[p as keyof DequeT],
    construct: () => DequeO.new(),
}) as unknown as DequeC;

const createDeque = <T>(raw: RawDeque<T>): Deque<T> => {
    const body: RawDeque<T> = Object.create(DequePrototype);
    body.head = raw.head;
    body.tail = raw.tail;
    body.body = raw.body;
    body.length = raw.length;

    const push_front = (v: T) => b_push_front(body, v);
    const pop_front = () => b_pop_front(body);
    const push_back = (v: T) => b_push_back(body, v);
    const pop_back = () => b_pop_back(body);
    const at_i = (i: number) => b_at(body, i);
    const at = (i: number) => {
        const len = body.length;
        b_at_opt(body, ((i % len) + len) % len);
    };
    const for_each = (f: Callback<T>) => b_for_each(body, f);
    const map = <U>(f: Callback<T, U>) => createDeque(b_map(body, f));
    const flat_map = <U>(f: Callback<T, Deque<U>>) => {
        const f2 = f as unknown as Callback<T, RawDeque<U>>;
        return createDeque(b_flat_map(body, f2));
    };
    const fold = <U>(init: U, f: (acc: U, current: T) => U) =>
        b_fold(body, init, f);
    const values = () => b_values(body);
    const keys = () => b_keys(body);
    const entries = () => b_entries(body);
    const clone = () =>
        createDeque({
            head: body.head,
            tail: body.tail,
            body: [...body.body],
            length: body.length,
        });

    const set_i = (i: number, v: T) => b_set_i(body, i, v);
    return new Proxy(body, {
        get: (_, p, _self: Deque<T>) => {
            if (
                typeof p === "string" &&
                // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                !isNaN(p as any) &&
                Number.isInteger(+p)
            ) {
                const i = Number(p);
                return at_i(i);
            } else if (p === "length") return body.length;
            else if (p === "at") return at;
            else if (p === "push_front") return push_front;
            else if (p === "pop_front") return pop_front;
            else if (p === "push_back") return push_back;
            else if (p === "pop_back") return pop_back;
            else if (p === "forEach") return for_each;
            else if (p === "map") return map;
            else if (p === "flat_map") return flat_map;
            else if (p === "fold") return fold;
            else if (p === "clone") return clone;
            else if (p === "values") return values;
            else if (p === "keys") return keys;
            else if (p === "entries") return entries;
            else if (p === Symbol.iterator) return values;
            else return undefined;
        },
        set: (_, p, v, _self: Deque<T>) => {
            if (
                typeof p === "string" &&
                // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                !isNaN(p as any) &&
                Number.isInteger(+p)
            ) {
                const i = Number(p);
                return set_i(i, v);
            } else return false;
        },
    }) as unknown as Deque<T>;
};
