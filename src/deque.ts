import { None, Some, type Option } from "./ns";

interface RawDeque<T> {
    stack_front: T[];
    stack_back: T[];
}

const b_push_front = <T>(self: RawDeque<T>, v: T) => {
    self.stack_front.push(v);
    return self.stack_back.length + self.stack_front.length;
};

const b_pop_front = <T>(self: RawDeque<T>) => {
    if (self.stack_front.length + self.stack_front.length === 0)
        return None<T>();
    if (self.stack_front.length === 0) {
        while (self.stack_back.length > 0) {
            self.stack_front.push(self.stack_back.pop()!);
        }
    }
    return Some(self.stack_front.pop()!);
};

const b_push_back = <T>(self: RawDeque<T>, v: T) => {
    self.stack_back.push(v);
    return self.stack_back.length + self.stack_front.length;
};

const b_pop_back = <T>(self: RawDeque<T>) => {
    if (self.stack_front.length + self.stack_front.length === 0)
        return None<T>();
    if (self.stack_back.length === 0) {
        while (self.stack_front.length > 0) {
            self.stack_back.push(self.stack_front.pop()!);
        }
    }
    return Some(self.stack_back.pop()!);
};

const b_at = <T>(self: RawDeque<T>, i: number) => {
    return i < self.stack_front.length
        ? self.stack_front[self.stack_front.length - i - 1]
        : self.stack_back[i - self.stack_front.length];
};

const b_at_opt = <T>(self: RawDeque<T>, i: number) => {
    if (0 <= i && i < self.stack_front.length + self.stack_back.length)
        return Some(b_at(self, i));
    else return None<T>();
};

type Callback<T, U = void> = (value: T, index: number) => U;

const b_for_each = <T>(
    self: RawDeque<T>,
    f: (value: T, index: number) => void,
) => {
    for (let i = 0; i < self.stack_front.length; i++) {
        f(self.stack_front[self.stack_front.length - i - 1], i);
    }
    for (let i = 0; i < self.stack_back.length; i++) {
        f(self.stack_front[i], i + self.stack_front.length);
    }
};

const b_map = <T, U>(self: RawDeque<T>, f: Callback<T, U>): RawDeque<U> => {
    return {
        stack_front: self.stack_front.map(f),
        stack_back: self.stack_back.map(f),
    };
};

const b_flat_map = <T, U>(
    self: RawDeque<T>,
    f: Callback<T, RawDeque<U>>,
): RawDeque<U> => {
    const back: U[] = [];
    b_for_each(self, (v, i) => {
        const d = f(v, i);
        back.push(...b_values(d));
    });
    return { stack_front: [], stack_back: back };
};

const b_fold = <T, U>(self: RawDeque<T>, init: U, f: (a: U, c: T) => U) => {
    let a = init;
    b_for_each(self, (c) => {
        a = f(a, c);
    });
    return a;
};

const b_values = function* <T>(self: RawDeque<T>): Generator<T> {
    const len = self.stack_front.length + self.stack_back.length;
    let i = 0;
    while (i < len) {
        yield b_at(self, i);
        i += 1;
    }
};

const b_keys = function* <T>(self: RawDeque<T>): Generator<number> {
    const len = self.stack_front.length + self.stack_back.length;
    let i = 0;
    while (i < len) {
        yield i;
        i += 1;
    }
};

const b_entries = function* <T>(self: RawDeque<T>): Generator<[number, T]> {
    const len = self.stack_front.length + self.stack_back.length;
    let i = 0;
    while (i < len) {
        yield [i, b_at(self, i)];
        i += 1;
    }
};

const b_set_i = <T>(self: RawDeque<T>, i: number, v: T) => {
    if (i < self.stack_front.length) {
        self.stack_front[self.stack_front.length - i - 1] = v;
        return true;
    } else if (self.stack_front.length + self.stack_back.length <= i) {
        self.stack_back[i - self.stack_front.length] = v;
        return true;
    }
    return false;
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
    new: <T>() => createDeque<T>({ stack_back: [], stack_front: [] }),
    from: <T>(init: T[] | Deque<T> | RawDeque<T>) => {
        if (Array.isArray(init))
            return createDeque<T>({ stack_back: init, stack_front: [] });
        if (Deque.is_deque<T>(init)) return init.clone();
        else return createDeque(init);
    },
    is_deque: <T = unknown>(v: unknown): v is Deque<T> =>
        Object.getPrototypeOf(v) === DequePrototype,
    [Symbol.hasInstance]: (v: unknown): boolean => DequeO.is_deque(v),
});

type DequeC = Readonly<DequeT> & { new <T>(): Deque<T> };

export const Deque: DequeC = new Proxy(DequeO, {
    construct: (target) => target.new(),
}) as DequeC;

const createDeque = <T>(raw: RawDeque<T>): Deque<T> => {
    const body: RawDeque<T> = Object.create(DequePrototype);
    body.stack_front = raw.stack_front;
    body.stack_back = raw.stack_back;

    const push_front = (v: T) => b_push_front(body, v);
    const pop_front = () => b_pop_front(body);
    const push_back = (v: T) => b_push_back(body, v);
    const pop_back = () => b_pop_back(body);
    const at_i = (i: number) => b_at(body, i);
    const at = (i: number) => {
        const len = body.stack_back.length + body.stack_front.length;
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
            stack_front: [...body.stack_front],
            stack_back: [...body.stack_back],
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
            } else if (p === "length")
                return body.stack_back.length + body.stack_front.length;
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
